export interface NewAdminPayload {
  username: string;
  password: string;
  fullName: string;
  email: string;
  isSuperAdmin: boolean;
}

export interface PermissionItem {
  id: number;
  code: string;
  name: string;
  granted: boolean;
}

export interface ModulePermissions {
  moduleId: number;
  moduleCode: string;
  moduleName: string;
  permissions: PermissionItem[];
}

export interface AdminPermissions {
  adminId: string;
  isSuperAdmin: boolean;
  permissionCodes: string[];
  modulePermissions: ModulePermissions[];
}
