'use client'

import { useEffect } from "react"
import { seedDatabase } from "@/actions/db-actions"

export default function SeedInitializer() {
  useEffect(() => {
    const hasSeeded = localStorage.getItem('dbSeeded');
    if (!hasSeeded) {
      seedDatabase().then(() => {
        localStorage.setItem('dbSeeded', 'true');
        console.log('Database seeding initiated.');
      }).catch(error => {
        console.error('Database seeding failed:', error);
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
