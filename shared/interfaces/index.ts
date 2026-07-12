export interface IBaseEntity {
  id: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CONTRIBUTOR = 'CONTRIBUTOR',
}

