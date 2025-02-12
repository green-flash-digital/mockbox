export type { Product, ProductCategory } from "../scripts/seed-products.js";
export type { User } from "../scripts/seed-users.js";

export type Pagination<T extends Record<string, unknown> = any> = {
  page: number;
  page_size: number;
  data: T[];
  next: number | null;
  pages: number;
  count: number;
};
