export interface UserStatusCountResponse {
  active: number;
  inactive: number;
  vacation: number;
  medicalLeave: number;
  suspended: number;
  total: number;
  totalUsersWithSystemAccess: number;
}

export interface PortStatusCountResponse{
  operational: number;
  underMaintenance: number;
  closed: number;
  full: number;
  inactive: number;
  total: number;
}