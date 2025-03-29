import { CreateTenant, CreateUser, Credentials, UpdateUser } from "../types";
import { api } from "./client";

export const authServiceApi = "/api/auth";
const catalogServiceApi = "/api/catalog";

export const login = (credentials: Credentials) =>
  api.post(`${authServiceApi}/auth/login`, credentials);

export const self = () => api.get(`${authServiceApi}/auth/self`);

export const logout = () => api.post(`${authServiceApi}/auth/logout`);

export const getUsers = (queryString: string) =>
  api.get(`${authServiceApi}/users/?${queryString}`);

export const getTenants = (queryString: string) =>
  api.get(`${authServiceApi}/tenants/?${queryString}`);

export const createTenant = (tenant: CreateTenant) =>
  api.post(`${authServiceApi}/tenants`, tenant);

export const createUser = (user: CreateUser) =>
  api.post(`${authServiceApi}/users`, user);

export const updateUser = (user: UpdateUser, id: string) =>
  api.patch(`${authServiceApi}/users/${id}`, user);

export const deleteUser = (userId: string) =>
  api.delete(`${authServiceApi}/users/${userId}`);

export const getCategories = (queryString: string) =>
  api.get(`${catalogServiceApi}/categories?${queryString}`);
