export type HttpMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "OPTIONS"
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

export type RequestCreator<Init extends Partial<RequestInit> = RequestInit> = (
  input: RequestInfo | URL,
  init?: Init,
) => Request;
