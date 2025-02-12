import { randProduct } from "@ngneat/falso";
import { createData } from "../utils/util.create-data.js";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  image: string;
  rating: {
    rate: string;
    count: string;
  };
};
export type ProductCategory = { id: number } & Pick<Product, "category">;

export async function seedProducts() {
  const products = await createData(randProduct, "/products", 500);
  const categories = [
    ...new Set(products.map((thing) => thing.category)).values(),
  ].map((category) => ({ category }));
  await createData(categories, "/products/categories");
}
