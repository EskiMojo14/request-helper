import type { BodyHttpMethod, HttpMethod } from "../types";
import { bodyMethodsSet } from "../types";
import { safeAssign } from ".";

export function assertCanHaveBody(
  method: HttpMethod,
): asserts method is BodyHttpMethod {
  if (!bodyMethodsSet.has(method)) {
    throw new Error(`Method ${method} cannot have a body`);
  }
}

const ensureHeaders = (headersInit: HeadersInit) =>
  headersInit instanceof Headers ? headersInit : new Headers(headersInit);

const setManyHeaders = (headers: Headers, headersInit: HeadersInit) => {
  for (const [key, value] of ensureHeaders(headersInit))
    headers.set(key, value);
};

export function mergeHeaders(
  ...headers: Array<HeadersInit | undefined>
): Headers {
  const result = new Headers();
  for (const source of headers) {
    if (source) setManyHeaders(result, source);
  }
  return result;
}

export function mergeRequestInits(
  ...inits: Array<RequestInit | undefined>
): RequestInit & { headers: Headers } {
  const result: RequestInit = {};
  const resultHeaders = new Headers();
  for (const init of inits) {
    if (!init) continue;

    const { headers, ...rest } = init;
    safeAssign(result, rest);

    if (headers) setManyHeaders(resultHeaders, headers);
  }
  return { ...result, headers: resultHeaders };
}

export const jsonInit = (body: any): RequestInit => ({
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify(body),
});
