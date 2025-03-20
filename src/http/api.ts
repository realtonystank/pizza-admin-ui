import { CreateTenant, CreateUser, Credentials } from "../types";
import { api } from "./client";

export const login = (credentials: Credentials) =>
  api.post("/auth/login", credentials);

export const self = () => api.get("/auth/self");

export const logout = () => api.post("/auth/logout");

export const getUsers = (queryString: string) =>
  api.get(`/users/?${queryString}`);

export const getTenants = () => api.get("/tenants");

export const createTenant = (tenant: CreateTenant) =>
  api.post("/tenants", tenant);

export const createUser = (user: CreateUser) => api.post("/users", user);
