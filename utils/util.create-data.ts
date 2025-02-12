import { tryHandle } from "./index.js";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.resolve(import.meta.dirname, `../public/data`);

export async function createData<T extends () => any>(
  entry: T,
  endpoint: string,
  numOfRecords?: number
): Promise<ReturnType<T>[]>;
export async function createData<T extends any[]>(
  entry: T,
  endpoint: string
): Promise<T>;
export async function createData<T extends any[] | (() => any)>(
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
