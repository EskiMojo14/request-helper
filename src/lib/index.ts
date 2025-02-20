import type { BodyHttpMethod, HttpMethod, RequestCreator } from "./types";
import type { Overwrite } from "./util";
import { jsonInit, mergeRequestInits } from "./util/http";

export class JsonRequest extends Request {
  static json(
    input: RequestInfo | URL,
    body: any,
    init: Overwrite<
      Omit<RequestInit, "body">,
      { method?: BodyHttpMethod }
    > = {},
  ) {
    init.method ??= "POST";
    return new Request(input, mergeRequestInits(init, jsonInit(body)));
  }
}

const makeBodylessRequestHelper =
  (method: HttpMethod): RequestCreator<[init?: Omit<RequestInit, "body">]> =>
  (input, init) =>
    new Request(input, mergeRequestInits(init, { method }));

function makeBodyRequestHelper(method: BodyHttpMethod) {
  // annotate to allow body
  const baseHelper: RequestCreator<[init?: Omit<RequestInit, "method">]> =
    makeBodylessRequestHelper(method);
  return Object.assign(baseHelper, {
    json(
      input: RequestInfo | URL,
      body: any,
      init?: Omit<RequestInit, "body" | "method">,
    ) {
      return baseHelper(input, mergeRequestInits(init, jsonInit(body)));
    },
  });
}

export class HttpRequest extends JsonRequest {
  // bodyless methods
  static get = makeBodylessRequestHelper("GET");
  static head = makeBodylessRequestHelper("HEAD");
  static options = makeBodylessRequestHelper("OPTIONS");
  static connect = makeBodylessRequestHelper("CONNECT");
  static trace = makeBodylessRequestHelper("TRACE");
  // body methods
  static post = makeBodyRequestHelper("POST");
  static delete = makeBodyRequestHelper("DELETE");
  static put = makeBodyRequestHelper("PUT");
  static patch = makeBodyRequestHelper("PATCH");
}
