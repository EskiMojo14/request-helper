export type HttpMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH";

export const bodyHttpMethods = [
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
] as const satisfies Array<HttpMethod>;
export const bodyMethodsSet = new Set<HttpMethod>(bodyHttpMethods);

export type BodyHttpMethod = (typeof bodyHttpMethods)[number];
export type BodylessHttpMethod = Exclude<HttpMethod, BodyHttpMethod>;

export type RequestCreator<Args extends Array<unknown> = [init?: RequestInit]> =
  (input: RequestInfo | URL, ...args: Args) => Request;
