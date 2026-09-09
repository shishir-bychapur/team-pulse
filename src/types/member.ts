export interface MemberWithRole {
  id: string;
  name: string;
  role: Role;
  timezone: string;
  roleId: string;
  email: string;
}

export interface Role {
  id: string;
  name: string;
}
