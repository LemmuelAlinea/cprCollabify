// Role and status shared types plus role-to-landing-path mapping.

export type Role = "superadmin" | "bsit_admin" | "professor" | "student";
export type AccountStatus = "active" | "pending" | "suspended";

export interface Profile {
  id: string;
  role: Role;
  status: AccountStatus;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

// Where a user lands after auth, based on role and status.
export function roleHome(profile: Pick<Profile, "role" | "status">): string {
  if (profile.role === "professor" && profile.status !== "active") return "/pending";
  switch (profile.role) {
    case "superadmin":
      return "/superadmin";
    case "bsit_admin":
      return "/admin";
    case "professor":
      return "/professor";
    case "student":
      return "/student";
    default:
      return "/";
  }
}
