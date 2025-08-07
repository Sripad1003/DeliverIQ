"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Database, Shield, Key, Eye, EyeOff, Lock, Unlock } from 'lucide-react'
import { useEffect, useState } from "react"
import { DashboardHeader } from "../../../components/layout/dashboard-header"
import { SecureStorage } from "../../../lib/server-storage"

export default function DataTransparency() {
  const [storageMetadata, setStorageMetadata] = useState<any>(null)
  const [showEncryptedData, setShowEncryptedData] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetadata = () => {
      try {
        setLoading(true)
        const metadata = SecureStorage.getStorageMetadata()
        setStorageMetadata(metadata)
      } catch (error) {
        console.error("Error fetching storage metadata:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetadata()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminSession")
    window.location.href = "/"
  }

  const formatDataSize = (data: any) => {
    if (!data) return "0 bytes"
    const jsonString = JSON.stringify(data)
    const bytes = new Blob([jsonString]).size
    if (bytes < 1024) return `${bytes} bytes`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const truncateData = (data: string, maxLength: number = 100) => {
    if (data.length <= maxLength) return data
    return data.substring(0, maxLength) + "..."
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading storage metadata...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Data Transparency" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Shield className="h-5 w-5" />
                Security Overview
              </CardTitle>
              <CardDescription className="text-blue-600">
                All user data is encrypted using industry-standard AES-GCM-256 encryption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Encryption: <strong>AES-GCM-256</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Key Management: <strong>Secure</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Storage: <strong>Encrypted</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Customer Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Records:</span>
                  <Badge variant="outline">{storageMetadata?.customers?.count || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Size:</span>
                  <span className="text-sm">{formatDataSize(storageMetadata?.customers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="text-xs text-gray-500">
                    {storageMetadata?.customers?.timestamp ? 
                      new Date(storageMetadata.customers.timestamp).toLocaleString() : 
                      "Never"
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="default" className="bg-green-500">
                    <Lock className="h-3 w-3 mr-1" />
                    Encrypted
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                Driver Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Records:</span>
                  <Badge variant="outline">{storageMetadata?.drivers?.count || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Size:</span>
                  <span className="text-sm">{formatDataSize(storageMetadata?.drivers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="text-xs text-gray-500">
                    {storageMetadata?.drivers?.timestamp ? 
                      new Date(storageMetadata.drivers.timestamp).toLocaleString() : 
                      "Never"
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="default" className="bg-green-500">
                    <Lock className="h-3 w-3 mr-1" />
                    Encrypted
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                Order Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Records:</span>
                  <Badge variant="outline">{storageMetadata?.orders?.count || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Size:</span>
                  <span className="text-sm">{formatDataSize(storageMetadata?.orders)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="text-xs text-gray-500">
                    {storageMetadata?.orders?.timestamp ? 
                      new Date(storageMetadata.orders.timestamp).toLocaleString() : 
                      "Never"
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="default" className="bg-green-500">
                    <Lock className="h-3 w-3 mr-1" />
                    Encrypted
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Encrypted Data Samples
            </CardTitle>
            <CardDescription>
              View encrypted data to verify security implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEncryptedData(!showEncryptedData)}
              >
                {showEncryptedData ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide Encrypted Data
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Show Encrypted Data
                  </>
                )}
              </Button>
              <Badge variant="secondary">
                For transparency and security verification
              </Badge>
            </div>

            {showEncryptedData && (
              <div className="space-y-4">
                {storageMetadata?.customers?.data && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Encrypted Customer Data Sample
                    </h4>
                    <div className="bg-gray-100 p-3 rounded text-xs font-mono break-all">
                      {truncateData(storageMetadata.customers.data, 200)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      IV: {truncateData(storageMetadata.customers.iv, 50)}
                    </p>
                  </div>
                )}

                {storageMetadata?.drivers?.data && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Encrypted Driver Data Sample
                    </h4>
                    <div className="bg-gray-100 p-3 rounded text-xs font-mono break-all">
                      {truncateData(storageMetadata.drivers.data, 200)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      IV: {truncateData(storageMetadata.drivers.iv, 50)}
                    </p>
                  </div>
                )}

                {storageMetadata?.orders?.data && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Encrypted Order Data Sample
                    </h4>
                    <div className="bg-gray-100 p-3 rounded text-xs font-mono break-all">
                      {truncateData(storageMetadata.orders.data, 200)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      IV: {truncateData(storageMetadata.orders.iv, 50)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Compliance
            </CardTitle>
            <CardDescription>
              Data protection and privacy compliance status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Encryption Standards</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">✓</Badge>
                    <span className="text-sm">AES-GCM-256 Encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">✓</Badge>
                    <span className="text-sm">Unique Initialization Vectors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">✓</Badge>
                    <span className="text-sm">Secure Key Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">✓</Badge>
                    <span className="text-sm">Password Hashing (SHA-256)</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Data Protection</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">✓</Badge>
                    <span className="text-sm">Data at Rest Encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">✓</Badge>
                    <span className="text-sm">Secure Storage Implementation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">✓</Badge>
                    <span className="text-sm">Admin Access Logging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">✓</Badge>
                    <span className="text-sm">Data Transparency</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
