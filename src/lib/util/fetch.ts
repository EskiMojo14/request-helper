import type { BodyHttpMethod, HttpMethod } from "../types";
import { bodyMethodsSet } from "../types";
import { safeAssign } from ".";

export function assertCanHaveBody(
  method: HttpMethod,
): asserts method is BodyHttpMethod {
  if (!bodyMethodsSet.has(method)) {
    throw new TypeError(`Method ${method} cannot have a body`);
  }
}

const ensureHeaders = (headersInit: HeadersInit) =>
  headersInit instanceof Headers ? headersInit : new Headers(headersInit);

const setManyHeaders = (headers: Headers, headersInit: HeadersInit) => {
  for (const [key, value] of ensureHeaders(headersInit))
    headers.set(key, value);
};

export function mergeHeaderInits(
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
  const signals: Array<AbortSignal> = [];
  for (const init of inits) {
    if (!init) continue;

    const { headers, signal, ...rest } = init;
    safeAssign(result, rest);

    if (headers) setManyHeaders(resultHeaders, headers);
    if (signal) signals.push(signal);
  }
  if (signals.length === 1) result.signal = signals[0];
  else if (signals.length) result.signal = AbortSignal.any(signals);

  return {
    ...result,
    headers: resultHeaders,
  };
}
