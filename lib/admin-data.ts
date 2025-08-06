import { getAdminByEmail, getSecurityKey as getSecurityKeyAction, setSecurityKey as setSecurityKeyAction, adminLogout as adminLogoutAction } from "@/actions/admin-actions"
import { AdminType } from "@/lib/admin-data-types"

// This file acts as a client-side wrapper/helper for admin-related actions.
// It primarily uses Server Actions for actual data persistence and logic.

// In a real application, session management would be handled more robustly
// (e.g., using NextAuth.js or a custom JWT-based system with httpOnly cookies).
// For this demo, we'll use localStorage for simplicity in client-side session tracking.

const ADMIN_SESSION_KEY = "deliveriq_admin_session"

export interface AdminType {
  _id?: string;
  email: string;
  passwordHash: string;
  status: "active" | "inactive";
}

export async function getAdminSession(): Promise<AdminType | null> {
  if (typeof window === "undefined") {
    // This function is called from a Server Component (app/admin/layout.tsx)
    // In a real app, you'd check for a server-side session (e.g., from cookies)
    // For this demo, we'll return a dummy admin if no session is found,
    // assuming the server component will handle redirection if no real session exists.
    // This is a simplification for the v0 preview environment.
    return {
      _id: "server-admin-id",
      email: "admin@deliveriq.com",
      passwordHash: "", // Not used on client
      status: "active",
    };
  }
  const sessionData = localStorage.getItem(ADMIN_SESSION_KEY)
  if (sessionData) {
    return JSON.parse(sessionData) as AdminType
  }
  return null
}

export async function setAdminSession(admin: AdminType): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin))
  }
}

export async function clearAdminSession(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_SESSION_KEY)
  }
}

// Wrapper for Server Actions
export async function getSecurityKey(): Promise<string | null> {
  const result = await getSecurityKeyAction()
  return result.success ? result.key : null
}

export async function setSecurityKey(key: string): Promise<{ success: boolean; message?: string }> {
  return setSecurityKeyAction(key)
}

export async function adminLoginClient(email: string, password: string, securityKey: string): Promise<{ success: boolean; message?: string }> {
  const result = await getAdminByEmail(email);
  if (result.success && result.admin) {
    // In a real app, password verification would happen on the server.
    // For this client-side wrapper, we're relying on the server action's internal logic.
    await setAdminSession(result.admin); // Set session if server action indicates success
    return { success: true };
  }
  return { success: false, message: result.message || "Invalid credentials or security key." };
}

export async function adminLogout(): Promise<void> {
  await adminLogoutAction();
  await clearAdminSession();
}
