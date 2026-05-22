export interface UserStatusCountResponse {
  active: number;
  inactive: number;
  vacation: number;
  medicalLeave: number;
  suspended: number;
  total: number;
  totalUsersWithSystemAccess: number;
}
