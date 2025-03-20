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
  tenantId: number | null;
};
export type CreateUser = Omit<User, "id" | "createdAt"> & { password: string };

export type Tenant = {
  id: number;
  name: string;
  address: string;
};
