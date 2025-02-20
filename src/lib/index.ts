import type { BodyHttpMethod, HttpMethod, RequestCreator } from "./types";
import type { Overwrite } from "./util";
import { mergeRequestInits } from "./util/http";

export class JsonRequest extends Request {
  constructor(
    input: RequestInfo | URL,
    body: any,
    init: Overwrite<
      Omit<RequestInit, "body">,
      { method?: BodyHttpMethod }
    > = {},
  ) {
    init.method ??= "POST";
    super(
      input,
      mergeRequestInits(init, {
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      }),
    );
  }
  static json(...args: ConstructorParameters<typeof JsonRequest>) {
    return new JsonRequest(...args);
  }
}

const makeBodylessRequestHelper =
  (method: HttpMethod): RequestCreator<[init?: Omit<RequestInit, "body">]> =>
  (input, init) =>
    new Request(input, { ...init, method });

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
      return new JsonRequest(input, body, { ...init, method });
    },
  });
}

export class HttpRequest extends Request {
  static json(...args: ConstructorParameters<typeof JsonRequest>) {
    return new JsonRequest(...args);
  }
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
