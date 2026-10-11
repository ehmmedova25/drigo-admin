export interface Admin {
  id: string;
  username: string;
  email: string;
  fullName: string;
  isSuperAdmin: boolean;
}

export interface MyPermissions {
  adminId: string;
  isSuperAdmin: boolean;
  permissionCodes: string[];
}

export type Permission =
  | 'dashboard.view'
  | 'rentals.view'
  | 'customers.view'
  | 'cars.view'
  | 'reservations.view'
  | 'delivery.view'
  | 'debts.view'
  | 'fines.view'
  | 'support.view'
  | 'analytics.view'
  | 'tariffs.view'
  | 'promotions.view'
  | 'fleet.view'
  | 'settings.view'
  | 'admins.view';
