// This file can be used for any vehicle-related logic, e.g., calculating optimal routes,
// estimating delivery times based on vehicle type, etc.
// For now, it's a placeholder.

export function calculateEstimatedDeliveryTime(distanceKm: number, vehicleType: string): string {
    let speedKmPerHour: number;

    switch (vehicleType.toLowerCase()) {
        case 'motorcycle':
            speedKmPerHour = 30; // Average city speed
            break;
        case 'car':
            speedKmPerHour = 40; // Average city speed
            break;
        case 'van':
            speedKmPerHour = 35;
            break;
        case 'truck':
            speedKmPerHour = 25;
            break;
        default:
            speedKmPerHour = 30; // Default to motorcycle speed
    }

    const hours = distanceKm / speedKmPerHour;
    const minutes = Math.round(hours * 60);

    if (minutes < 60) {
        return `${minutes} minutes`;
    } else {
        const estHours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${estHours} hours ${remainingMinutes} minutes`;
    }
}

export function getVehicleType(weight: number, dimensions: { length: number; width: number; height: number }): string {
  const volume = dimensions.length * dimensions.width * dimensions.height;

  if (weight <= 50 && volume <= 0.5) {
    return "Motorcycle";
  } else if (weight <= 500 && volume <= 5) {
    return "Car";
  } else if (weight <= 2000 && volume <= 15) {
    return "Van";
  } else if (weight <= 10000 && volume <= 50) {
    return "Truck";
  } else {
    return "Heavy Duty Truck";
  }
}

export function calculateDeliveryTime(distanceKm: number, trafficFactor: number = 1): number {
  // Average speed in km/h (e.g., 40 km/h for urban areas)
  const averageSpeedKmH = 40;
  const baseTimeHours = distanceKm / averageSpeedKmH;

  // Apply traffic factor (1.0 for no traffic, >1.0 for more traffic)
  const adjustedTimeHours = baseTimeHours * trafficFactor;

  // Convert to minutes
  return adjustedTimeHours * 60;
}

export function calculateDeliveryCost(distanceKm: number, itemWeightKg: number, vehicleType: string): number {
  let baseRatePerKm = 0.5; // USD per km
  let weightRatePerKg = 0.1; // USD per kg

  // Adjust rates based on vehicle type
  switch (vehicleType) {
    case "Motorcycle":
      baseRatePerKm = 0.3;
      weightRatePerKg = 0.05;
      break;
    case "Car":
      baseRatePerKm = 0.5;
      weightRatePerKg = 0.1;
      break;
    case "Van":
      baseRatePerKm = 0.8;
      weightRatePerKg = 0.2;
      break;
    case "Truck":
      baseRatePerKm = 1.2;
      weightRatePerKg = 0.3;
      break;
    case "Heavy Duty Truck":
      baseRatePerKm = 1.8;
      weightRatePerKg = 0.5;
      break;
  }

  const distanceCost = distanceKm * baseRatePerKm;
  const weightCost = itemWeightKg * weightRatePerKg;

  // Add a small flat fee for handling
  const handlingFee = 2.0;

  return distanceCost + weightCost + handlingFee;
}

// You could add more complex logic here, e.g.,
// export function getAvailableVehicles(location: string, itemWeight: number): string[] {
//     // Logic to filter vehicles based on location and item capacity
//     return ['Motorcycle', 'Car', 'Van', 'Truck'];
// }
