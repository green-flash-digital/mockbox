import { randProduct, randUser } from "@ngneat/falso";
import { tryHandle } from "../utils/index.js";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.resolve(import.meta.dirname, `../public/data`);

async function createData<T extends () => any>(
  entry: T,
  endpoint: string,
  numOfRecords?: number
): Promise<ReturnType<T>[]>;
async function createData<T extends any[]>(
  entry: T,
  endpoint: string
): Promise<T>;
async function createData<T extends any[] | (() => any)>(
  entry: T,
  endpoint: string,
  numOfRecords = 500
) {
  const arr = Array.isArray(entry)
    ? entry
    : [...new Array(numOfRecords)].map(() => entry());
  const data = arr.map((record, i) => ({
    ...record,
    id: i + 1,
  }));

  const ENDPOINT_DIR = path.join(DATA_DIR, endpoint);

  // If the endpoint has more than one slash, ensure that the endpoint directories are
  // recursively created
  const hasNestedPaths = endpoint.indexOf("/") !== endpoint.lastIndexOf("/");
  if (hasNestedPaths) {
    const endpointArr = endpoint.split("/");
    endpointArr.pop();
    const newEndpoint = path.join(DATA_DIR, endpointArr.join("/"));
    console.log({ ENDPOINT_DIR });
    const endpointDirRes = await tryHandle(mkdir)(newEndpoint, {
      recursive: true,
    });
    if (endpointDirRes.hasError) {
      throw endpointDirRes.error;
    }
  }

  // Create the data file
  const endpointPath = ENDPOINT_DIR.concat(".json");
  const endpointContent = JSON.stringify(data, null, 2);
  const res = await tryHandle(writeFile)(endpointPath, endpointContent);
  if (res.hasError) {
    throw res.error;
  }
  return data;
}

async function createEndpoints() {
  // Create product endpoints
  const products = await createData(randProduct, "/products", 500);
  const categories = [
    ...new Set(products.map((thing) => thing.category)).values(),
  ].map((category) => ({ category }));
  await createData(categories, "/products/categories/test");

  // Create user endpoints
  await createData(randUser, "/users", 500);
}

createEndpoints();
