export type UserRole = "doctor" | "admin" | "superadmin";

export type Specialization =
  | "general_physician"
  | "cardiologist"
  | "neurologist"
  | "pediatrician"
  | "orthopedic"
  | "dermatologist"
  | "psychiatrist"
  | "gynecologist"
  | "oncologist"
  | "other";

export type ConsultationStatus = "in_progress" | "completed" | "cancelled";

export type Speaker = "doctor" | "patient" | "unknown";

export type Gender = "male" | "female" | "other";

export interface User {
  id: number;
  uuid: string;
  full_name: string;
  // email: string;  // REMOVED — not exposed by backend
  role: UserRole;
  specialization?: Specialization;
  license_number?: string;
  license_verified: boolean;
  hospital_name?: string;
  phone_number?: string;
  // is_email_verified: boolean;  // REMOVED — no longer relevant
  is_active: boolean;
  created_at: string;
}

export interface Consultation {
  id: number;
  uuid: string;
  doctor_id: string;
  patient_name: string;
  patient_age?: number;
  patient_gender?: Gender;
  patient_phone?: string;
  chief_complaint?: string;
  status: ConsultationStatus;
  started_at: string;
  ended_at?: string;
  created_at: string;
  updated_at?: string;
  transcripts?: Transcript[];
}

export interface Transcript {
  id: number;
  uuid: string;
  consultation_id: string;
  speaker: Speaker;
  text: string;
  timestamp_start: number;
  timestamp_end?: number;
  confidence?: number;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface SoapNote {
  id: number;
  uuid: string;
  consultation_id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  is_approved: boolean;
  approved_at?: string;
  created_at: string;
  updated_at?: string;
}
