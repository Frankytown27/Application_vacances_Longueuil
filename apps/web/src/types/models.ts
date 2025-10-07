export interface Entitlement {
  year: number;
  vacation_days_remaining: number;
  ta_hours_remaining: number;
  personal_days_remaining: number;
}

export interface EmployeeProfile {
  id: string;
  full_name: string;
  team: string;
  division?: string;
  seniority_date: string;
  entitlements: Entitlement[];
}

export interface Week {
  id: string;
  monday_date: string;
  year: number;
  week_number_iso: number;
  is_holiday_week: boolean;
}

export type TimeOffType = "VAC" | "TA" | "PER" | "CM" | "OTHER";

export interface TimeOffRequest {
  id: string;
  type: TimeOffType;
  start_date: string;
  end_date: string;
  status: "draft" | "submitted" | "approved" | "rejected" | "locked";
  partial_day?: "AM" | "PM" | "FULL";
  requestWeeks: { weekId: string; days_in_week: number }[];
}
