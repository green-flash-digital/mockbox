/**
 * Extends the Response class to accept JSON
 * and properly set the headers
 */
export class ResponseJSON extends Response {
  constructor(data: any, init?: ResponseInit) {
    const jsonString = JSON.stringify(data);
    super(jsonString, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Max-Age": "86400",
        ...(init?.headers || {}),
      },
    });
  }
}
