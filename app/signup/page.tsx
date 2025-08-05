"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Truck, User, Car, Shield } from "lucide-react"
import { StatusAlert } from "@/components/ui/status-alert" // Import StatusAlert
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back" // Import PageHeaderWithBack
import { AuthCard } from "@/components/auth/auth-card" // Import AuthCard
import { initializeAppData, registerUser } from "@/lib/app-data"

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
      const newUser = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        vehicleType: formData.vehicleType as "bike" | "auto" | "car" | "van" | "truck",
        vehicleNumber: formData.vehicleNumber,
        licenseNumber: formData.licenseNumber,
        address: formData.address,
      })

      if (formData.role === "customer") {
        router.push("/customer/dashboard")
      } else if (formData.role === "driver") {
        router.push("/driver/dashboard")
      }

      setMessage({ type: "success", text: "Account created successfully!" })
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
        return User
      case "driver":
        return Car
      case "admin":
        return Shield
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
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <PageHeaderWithBack title="DeliverIQ" backLink="/" icon={Truck} />

        <StatusAlert message={message} />

        <AuthCard
          title="Sign Up for DeliverIQ"
          description={
            formData.role ? (
              <span className={getRoleColor()}>
                Join as a {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
              </span>
            ) : (
              "Choose your role and create your account"
            )
          }
          icon={getRoleIcon()}
          iconColorClass={getRoleColor()}
          footer={
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          }
        >
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
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </AuthCard>
      </div>
    </div>
  )
}
