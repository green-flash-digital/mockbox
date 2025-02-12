import { seedProducts } from "./seed-products.js";
import { seedUsers } from "./seed-users.js";

await Promise.all([seedProducts, seedUsers]);
