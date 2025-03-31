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

export type PriceConfiguration = {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: string[];
  };
};

export type Attribute = {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
};

export type Category = {
  _id: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
};

export type CreateTenant = Omit<Tenant, "id">;

export type FieldData = {
  name: string;
  value?: string;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  category: Category;
  status: boolean;
  createdAt: string;
  image: string;
  isPublished: boolean;
};

export type ImageField = { file: File };

export type CreateProductData = Product & { image: ImageField };
