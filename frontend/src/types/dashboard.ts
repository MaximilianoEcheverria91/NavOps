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

export interface ShipStatusCountResponse{
  operational: number;
  maintenance: number;
  repair: number;
  inTransit: number;
  outOfService: number;
  total: number;
}

export interface UserSystemAccesStatusCountResponse{
  adminUsers: number;
  chiefNavigationUsers: number;
  chiefOperationUsers: number;
  activeUsers: number;
  blockedUsers: number;
  inactiveUsers: number;
  total: number;
}