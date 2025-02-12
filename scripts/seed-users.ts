import { randUser } from "@ngneat/falso";
import { createData } from "../utils/util.create-data.js";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  img: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  phone: string;
};

// Create user endpoints
export async function seedUsers() {
  await createData(randUser, "/users", 500);
}
