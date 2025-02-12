import { ResponseJSON } from "./ResponseJSON.js";

type RequestSort = {
  sortBy: string[];
  order: string[];
};
type RequestPagination = {
  page: number;
  limit: number;
};

function parseRequest<T extends Request>(request: T) {
  // Convert the request into a URL
  const url = new URL(request.url);

  // Get the data URL route
  const route = url.pathname.split("api")[1];
  const assetUrl = `${url.origin}/data${route}.json`;

  // Pagination params
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  // Sorting params
  const sortBy = (url.searchParams.get("sortBy") || "id").split(",");
  const order = (url.searchParams.get("order") || "asc").split(",");

  // Build the rest of the query params
  const query = Object.fromEntries(
    [...url.searchParams.entries()].filter(
      ([key]) => !["page", "limit", "sortBy", "order"].includes(key)
    )
  );

  return {
    assetUrl,
    pagination: { page, limit },
    sort: { sortBy, order },
    query,
  };
}

async function fetchData(
  env: {
    ASSETS: {
      fetch: typeof fetch;
    };
  },
  url: string
) {
  const res = await env.ASSETS.fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  let items = (await res.json()) as any[];
  return items;
}

async function filterData(data: any[], query: { [key: string]: string }) {
  Object.entries(query).forEach(([key, value]) => {
    data = data.filter((item) =>
      String(item[key]).toLowerCase().includes(value.toLowerCase())
    );
  });
  return data;
}

async function sortData(data: any[], sort: RequestSort) {
  return data.sort((a, b) => {
    for (let i = 0; i < sort.sortBy.length; i++) {
      const key = sort.sortBy[i];
      const sortOrder = sort.order[i] === "desc" ? -1 : 1;

      if (a[key] > b[key]) return sortOrder;
      if (a[key] < b[key]) return -sortOrder;
    }
    return 0;
  });
}

// Pagination logic
async function paginateData(items: any[], pagination: RequestPagination) {
  const startIndex = (pagination.page - 1) * pagination.limit;
  const data = items.slice(startIndex, startIndex + pagination.limit);
  return data;
}

export const handleRequest: PagesFunction = async ({ request, env }) => {
  const { assetUrl, pagination, sort, query } = parseRequest(request);

  const dataRaw = await fetchData(env, assetUrl);
  const dataFiltered = await filterData(dataRaw, query);
  const dataSorted = await sortData(dataFiltered, sort);
  const dataPaginated = await paginateData(dataSorted, pagination);

  const json = { ...pagination, data: dataPaginated };
  return new ResponseJSON(json);
};
