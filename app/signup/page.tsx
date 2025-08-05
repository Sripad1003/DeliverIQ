"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Truck, ArrowLeft, User, Car, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { initializeAppData, createCustomer, createDriver, loginCustomer, loginDriver } from "@/lib/app-data"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "",
    // Driver specific
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
    // Customer specific
    address: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState({ type: "", text: "" }) // Add message state

  useEffect(() => {
    initializeAppData()
    const roleParam = searchParams.get("role")
    if (roleParam) {
      setFormData((prev) => ({ ...prev, role: roleParam }))
    }
  }, [searchParams.get("role")])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: "", text: "" }) // Clear previous messages

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords don't match" })
      return
    }

    if (formData.password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long" })
      return
    }

    setIsLoading(true)

    try {
      if (formData.role === "customer") {
        const newCustomer = await createCustomer({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
        })
        loginCustomer({
          id: newCustomer.id,
          email: newCustomer.email,
          name: newCustomer.name,
          loginTime: new Date().toISOString(),
        })
        setMessage({ type: "success", text: "Customer account created successfully!" })
        router.push("/customer/dashboard")
      } else if (formData.role === "driver") {
        const newDriver = await createDriver({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          vehicleType: formData.vehicleType as "bike" | "auto" | "car" | "van" | "truck",
          vehicleNumber: formData.vehicleNumber,
          licenseNumber: formData.licenseNumber,
        })
        loginDriver({
          id: newDriver.id,
          email: newDriver.email,
          name: newDriver.name,
          vehicleType: newDriver.vehicleType,
          loginTime: new Date().toISOString(),
        })
        setMessage({ type: "success", text: "Driver account created successfully!" })
        router.push("/driver/dashboard")
      } else {
        setMessage({ type: "error", text: "Please select a role." })
      }
    } catch (error) {
      console.error("Signup error:", error)
      setMessage({ type: "error", text: "Failed to create account. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleIcon = () => {
    switch (formData.role) {
      case "customer":
        return <User className="h-6 w-6 text-blue-600" />
      case "driver":
        return <Car className="h-6 w-6 text-green-600" />
      case "admin":
        return <Shield className="h-6 w-6 text-purple-600" />
      default:
        return null
    }
  }

  const getRoleColor = () => {
    switch (formData.role) {
      case "customer":
        return "text-blue-600"
      case "driver":
        return "text-green-600"
      case "admin":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Truck className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Trolla</h1>
          </div>
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

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              {getRoleIcon()}
              <span>Create Account</span>
            </CardTitle>
            <CardDescription className="text-center">
              {formData.role ? (
                <span className={getRoleColor()}>
                  Join as a {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                </span>
              ) : (
                "Choose your role and create your account"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">I want to join as</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer - Book Transport</SelectItem>
                    <SelectItem value="driver">Driver - Provide Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Common Fields */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              {/* Role-specific fields */}
              {formData.role === "driver" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select
                      value={formData.vehicleType}
                      onValueChange={(value) => handleInputChange("vehicleType", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="auto">Auto Rickshaw</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                    <Input
                      id="vehicleNumber"
                      placeholder="Enter vehicle number"
                      value={formData.vehicleNumber}
                      onChange={(e) => handleInputChange("vehicleNumber", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      placeholder="Enter license number"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {formData.role === "customer" && (
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
