import type { Item } from "./app-data"

export type VehicleType = "bike" | "auto" | "car" | "van" | "truck"

interface VehicleCapacity {
  maxWeight: number // kg
  maxVolume: number // cubic meters
  basePrice: number // base price per km
  description: string
}

const VEHICLE_CAPACITIES: Record<VehicleType, VehicleCapacity> = {
  bike: {
    maxWeight: 20,
    maxVolume: 0.1,
    basePrice: 5,
    description: "Small items, documents"
  },
  auto: {
    maxWeight: 100,
    maxVolume: 0.5,
    basePrice: 8,
    description: "Medium packages, groceries"
  },
  car: {
    maxWeight: 200,
    maxVolume: 1.0,
    basePrice: 12,
    description: "Luggage, small furniture"
  },
  van: {
    maxWeight: 500,
    maxVolume: 3.0,
    basePrice: 18,
    description: "Furniture, appliances"
  },
  truck: {
    maxWeight: 2000,
    maxVolume: 10.0,
    basePrice: 25,
    description: "Heavy goods, bulk items"
  }
}

export function calculateDistance(pickup: string, delivery: string): number {
  // Simplified distance calculation
  // In real app, use Google Maps API or similar
  const hash = pickup.length + delivery.length
  return Math.max(10, hash * 2 + Math.random() * 50)
}

export function calculateItemVolume(item: Item): number {
  return item.length * item.width * item.height * item.quantity
}

export function calculateTotalWeight(items: Item[]): number {
  return items.reduce((total, item) => total + (item.weight * item.quantity), 0)
}

export function calculateTotalVolume(items: Item[]): number {
  return items.reduce((total, item) => total + calculateItemVolume(item), 0)
}

export function suggestVehicles(items: Item[], distance: number): Array<{
  type: VehicleType
  estimatedPrice: number
  description: string
}> {
  const totalWeight = calculateTotalWeight(items)
  const totalVolume = calculateTotalVolume(items)
  
  const suggestions: Array<{
    type: VehicleType
    estimatedPrice: number
    description: string
  }> = []

  // Check each vehicle type
  Object.entries(VEHICLE_CAPACITIES).forEach(([type, capacity]) => {
    if (totalWeight <= capacity.maxWeight && totalVolume <= capacity.maxVolume) {
      const basePrice = capacity.basePrice * distance
      const weightFactor = totalWeight / capacity.maxWeight
      const volumeFactor = totalVolume / capacity.maxVolume
      const utilizationFactor = Math.max(weightFactor, volumeFactor)
      
      const estimatedPrice = basePrice * (1 + utilizationFactor * 0.5)
      
      suggestions.push({
        type: type as VehicleType,
        estimatedPrice: Math.round(estimatedPrice),
        description: capacity.description
      })
    }
  })

  // Sort by price (cheapest first)
  return suggestions.sort((a, b) => a.estimatedPrice - b.estimatedPrice)
}
