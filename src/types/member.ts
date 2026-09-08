export interface Member {
  id: string;
  name: string;
  role: Role;
  timezone: string;
}

export interface MemberWithRole {
  id: string;
  name: string;
  role: Role;
  timezone: string;
  roleId: string;
}

export interface Role {
  id: string;
  name: string;
}
