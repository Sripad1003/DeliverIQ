"use server"

import type { Item } from "./app-data"
import { redirect } from "next/navigation"

// Define vehicle capacities (max weight in kg, max volume in cubic meters)
export const VEHICLE_CAPACITIES = {
  bike: { maxWeight: 20, maxVolume: 0.1, description: "Small parcels, documents" },
  auto: { maxWeight: 150, maxVolume: 1.0, description: "Small boxes, groceries" },
  car: { maxWeight: 300, maxVolume: 2.0, description: "Medium boxes, luggage" },
  van: { maxWeight: 800, maxVolume: 6.0, description: "Furniture, appliances" },
  truck: { maxWeight: 5000, maxVolume: 20.0, description: "Heavy goods, large shipments" },
} as const // 'as const' makes the keys literal types

export type VehicleType = keyof typeof VEHICLE_CAPACITIES

// Define base prices per kilometer (in INR)
export const VEHICLE_PRICES_PER_KM = {
  bike: 10,
  auto: 15,
  car: 20,
  van: 30,
  truck: 50,
} as const

// Function to calculate total weight and volume of items
const calculateTotalLoad = (items: Item[]) => {
  let totalWeight = 0
  let totalVolume = 0 // in cubic meters

  for (const item of items) {
    totalWeight += item.weight * item.quantity
    totalVolume += item.length * item.width * item.height * item.quantity
  }
  return { totalWeight, totalVolume }
}

// Function to suggest suitable vehicles and calculate estimated prices
export const suggestVehicles = (items: Item[], distanceKm: number) => {
  const { totalWeight, totalVolume } = calculateTotalLoad(items)
  const suggestions: { type: VehicleType; estimatedPrice: number; description: string }[] = []

  for (const type of Object.keys(VEHICLE_CAPACITIES) as VehicleType[]) {
    const capacity = VEHICLE_CAPACITIES[type]
    if (totalWeight <= capacity.maxWeight && totalVolume <= capacity.maxVolume) {
      const estimatedPrice = calculatePrice(type, distanceKm)
      suggestions.push({
        type,
        estimatedPrice,
        description: capacity.description,
      })
    }
  }

  // Sort suggestions by price (cheapest first)
  return suggestions.sort((a, b) => a.estimatedPrice - b.estimatedPrice)
}

// Function to calculate the price for a given vehicle type and distance
export const calculatePrice = (vehicleType: VehicleType, distanceKm: number): number => {
  const pricePerKm = VEHICLE_PRICES_PER_KM[vehicleType]
  // Add a base fare or minimum charge if desired
  const baseFare = 50 // Example base fare
  return baseFare + pricePerKm * distanceKm
}

// Simple distance calculation (for demo purposes, assume straight line or fixed value)
export const calculateDistance = (pickup: string, delivery: string): number => {
  // In a real application, you would integrate with a mapping service API (e.g., Google Maps API)
  // For now, let's return a dummy distance based on some simple logic or a fixed value.
  // For example, if locations are different, return a default distance.
  if (pickup && delivery && pickup !== delivery) {
    // A more sophisticated demo might use a lookup table or a random range
    return 50 + Math.floor(Math.random() * 100) // Random distance between 50 and 150 km
  }
  return 0 // Same location or invalid input
}

export async function logoutDriver() {
  // In a real application, this would clear session cookies or tokens
  console.log("Driver logged out")
  redirect("/login")
}
