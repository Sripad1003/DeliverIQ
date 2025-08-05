"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Key, Copy, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"
import { initializeAdminData, getSecurityKeyPlain, setSecurityKey } from "@/lib/admin-data"
import { generateSecureKey } from "@/lib/security" // Add this import

export default function AdminSetupPage() {
  const [currentKey, setCurrentKey] = useState("TROLLA_ADMIN_2024")
  const [newKey, setNewKey] = useState("")
  const [confirmKey, setConfirmKey] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    initializeAdminData()
    const savedKey = getSecurityKeyPlain() // Get plain key for display
    setCurrentKey(savedKey)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessage({ type: "success", text: "Key copied to clipboard!" })
    setTimeout(() => setMessage({ type: "", text: "" }), 3000)
  }

  const updateSecurityKey = async () => {
    if (newKey !== confirmKey) {
      setMessage({ type: "error", text: "Keys don't match!" })
      return
    }

    if (newKey.length < 16) {
      setMessage({ type: "error", text: "Security key must be at least 16 characters long!" })
      return
    }

    try {
      // Hash and persist the new key
      await setSecurityKey(newKey)

      setCurrentKey(newKey)
      setNewKey("")
      setConfirmKey("")
      setMessage({
        type: "success",
        text: "Security key updated and encrypted successfully! Make sure to share this with authorized admins.",
      })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update security key" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Security Setup</h1>
          </div>
          <p className="text-gray-600">Manage admin security keys and access credentials</p>
        </div>

        {message.text && (
          <Alert
            className={`mb-6 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
          >
            {message.type === "error" ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Security Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-600" />
                Current Security Key
              </CardTitle>
              <CardDescription>This is the current admin security key required for admin login</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg font-mono text-sm break-all">{currentKey}</div>
              <Button onClick={() => copyToClipboard(currentKey)} variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy Current Key
              </Button>

              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Important:</strong> Keep this key secure and only share with authorized administrators.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Generate New Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-green-600" />
                Generate New Security Key
              </CardTitle>
              <CardDescription>Create a new secure key to replace the current one</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => {
                  // Wrap in an arrow function to prevent direct execution
                  setIsGenerating(true)
                  const newSecureKey = generateSecureKey() // Call the imported function
                  setNewKey(newSecureKey)
                  setIsGenerating(false)
                }}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Secure Key"}
              </Button>

              {newKey && (
                <>
                  <div className="space-y-2">
                    <Label>New Security Key</Label>
                    <div className="p-4 bg-green-50 rounded-lg font-mono text-sm break-all border border-green-200">
                      {newKey}
                    </div>
                    <Button onClick={() => copyToClipboard(newKey)} variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy New Key
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmKey">Confirm New Key</Label>
                    <Input
                      id="confirmKey"
                      type="password"
                      placeholder="Paste the new key to confirm"
                      value={confirmKey}
                      onChange={(e) => setConfirmKey(e.target.value)}
                    />
                  </div>

                  <Button onClick={updateSecurityKey} className="w-full bg-green-600 hover:bg-green-700">
                    Update Security Key
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Guidelines */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Security Guidelines</CardTitle>
            <CardDescription>Best practices for admin security key management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">✅ Do:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Store the key in a secure password manager</li>
                  <li>• Share only with verified administrators</li>
                  <li>• Change the key regularly (monthly/quarterly)</li>
                  <li>• Use secure communication channels to share</li>
                  <li>• Keep a backup of the key in a secure location</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 mb-2">❌ Don't:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Share the key via email or chat</li>
                  <li>• Store the key in plain text files</li>
                  <li>• Use the same key for extended periods</li>
                  <li>• Share with unauthorized personnel</li>
                  <li>• Write the key on physical notes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Credentials Reference */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Admin Login Credentials</CardTitle>
            <CardDescription>Complete credentials needed for admin access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Admin Email</h4>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">admin@trolla.com</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Password</h4>
                <p className="text-sm text-gray-600">Set by individual admin</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Security Key</h4>
                <p className="text-sm text-gray-600">Current key shown above</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
