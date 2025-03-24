import { CreateTenant, CreateUser, Credentials, UpdateUser } from "../types";
import { api } from "./client";

export const login = (credentials: Credentials) =>
  api.post("/auth/login", credentials);

export const self = () => api.get("/auth/self");

export const logout = () => api.post("/auth/logout");

export const getUsers = (queryString: string) =>
  api.get(`/users/?${queryString}`);

export const getTenants = (queryString: string) =>
  api.get(`/tenants/?${queryString}`);

export const createTenant = (tenant: CreateTenant) =>
  api.post("/tenants", tenant);

export const createUser = (user: CreateUser) => api.post("/users", user);

export const updateUser = (user: UpdateUser, id: string) =>
  api.patch(`/users/${id}`, user);

export const deleteUser = (userId: string) => api.delete(`/users/${userId}`);
