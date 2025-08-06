// This file contains types specific to admin data.

export interface AdminType {
  _id?: string; // MongoDB ObjectId
  email: string;
  passwordHash: string;
  status: "active" | "inactive";
}

export interface SettingType {
  _id?: string; // MongoDB ObjectId
  name: string;
  value: string;
}
