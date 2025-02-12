export type { Product, ProductCategory } from "../scripts/seed-products.js";
export type { User } from "../scripts/seed-users.js";

export type Pagination = {
  page: number;
  page_size: number;
  data: any[];
  next: number | null;
  pages: number;
  count: number;
};
