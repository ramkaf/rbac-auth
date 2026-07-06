export interface IPermission {
  id: string;
  title: string;
  description: string;
  category: string | null;
  roles: IRole[];
}

export interface IRole {
  id: string;
  title: string;
  description: string;
  permissions: IPermission[];
}
