export type Credentials = {
  email: string;
  password: string;
};
export type LoginFormData = {
  username: string;
  password: string;
};
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  role: string;
  tenant: Tenant;
};
export type CreateUser = Omit<User, "id" | "createdAt"> & { password: string };

export type UpdateUser = Omit<User, "id" | "createdAt">;

export type Tenant = {
  id: number;
  name: string;
  address: string;
};

export type CreateTenant = Omit<Tenant, "id">;

export type FieldData = {
  name: string;
  value?: string;
};
