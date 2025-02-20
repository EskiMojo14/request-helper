import type { BodyHttpMethod, HttpMethod, RequestCreator } from "./types";
import { assertCanHaveBody, mergeRequestInits } from "./util/http";

export interface JsonRequestInit extends Omit<RequestInit, "body"> {
  method?: BodyHttpMethod;
  replacer?:
    | ((this: any, key: string, value: any) => any)
    | Array<string | number>;
}

export class JsonRequest extends Request {
  constructor(
    input: RequestInfo | URL,
    body: any,
    { replacer, ...init }: JsonRequestInit = {},
  ) {
    if (init.method) assertCanHaveBody(init.method);
    super(
      input,
      mergeRequestInits(init, {
        method: init.method ?? "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body, replacer as never),
      }),
    );
  }
  static json(...args: ConstructorParameters<typeof JsonRequest>) {
    return new JsonRequest(...args);
  }
}

const makeBodylessRequestHelper =
  (
    method: HttpMethod,
  ): RequestCreator<[init?: Omit<RequestInit, "body" | "method">]> =>
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
      init?: Omit<JsonRequestInit, "method">,
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
  // body methods
  static post = makeBodyRequestHelper("POST");
  static delete = makeBodyRequestHelper("DELETE");
  static put = makeBodyRequestHelper("PUT");
  static patch = makeBodyRequestHelper("PATCH");
}
