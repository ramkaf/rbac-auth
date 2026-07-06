import { IRole } from "@modules/rbac/interfaces/rbac.interface";

export interface IUserWithRoleAndPermission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: IRole;
}
