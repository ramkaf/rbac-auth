export interface IPermission {
  id: number;

  name: string;

  description: string;

  category: string | null;

  roles: IRole[];

  uuid: string;
}

export interface IRole {
  id: number;
  name: string;
  description: string;
  permissions: IPermission[];
}
