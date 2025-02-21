import type { BodyHttpMethod, HttpMethod, RequestCreator } from "./types";
import { mergeRequestInits } from "./util/fetch";

export interface JsonRequestInit extends Omit<RequestInit, "body"> {
  method?: BodyHttpMethod;
  replacer?:
    | ((this: any, key: string, value: any) => any)
    | Array<string | number>;
}

export class JsonRequest extends Request {
  constructor(input: RequestInfo | URL, body: any, init: JsonRequestInit = {}) {
    const { replacer, method = "POST", ...rest } = init;
    super(
      input,
      mergeRequestInits(rest, {
        method,
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

export interface FormDataRequestInit extends Omit<RequestInit, "body"> {
  method?: BodyHttpMethod;
}

export class FormDataRequest extends Request {
  constructor(
    input: RequestInfo | URL,
    formData: FormData,
    init: FormDataRequestInit = {},
  ) {
    const { method = "POST", ...rest } = init;
    super(input, { ...rest, method, body: formData });
  }
  static formData(...args: ConstructorParameters<typeof FormDataRequest>) {
    return new FormDataRequest(...args);
  }
}

const makeBodylessRequestHelper =
  (method: HttpMethod): RequestCreator<Omit<RequestInit, "body" | "method">> =>
  (input, init) =>
    new Request(input, { ...init, method });

function makeBodyRequestHelper(method: BodyHttpMethod) {
  // annotate to allow body
  const baseHelper: RequestCreator<Omit<RequestInit, "method">> =
    makeBodylessRequestHelper(method);
  return Object.assign(baseHelper, {
    json(
      input: RequestInfo | URL,
      body: any,
      init?: Omit<JsonRequestInit, "method">,
    ) {
      return new JsonRequest(input, body, { ...init, method });
    },
    formData(
      input: RequestInfo | URL,
      formData: FormData,
      init?: Omit<FormDataRequestInit, "method">,
    ) {
      return new FormDataRequest(input, formData, { ...init, method });
    },
  });
}

export class HttpRequest extends Request {
  static json(...args: ConstructorParameters<typeof JsonRequest>) {
    return new JsonRequest(...args);
  }
  static formData(...args: ConstructorParameters<typeof FormDataRequest>) {
    return new FormDataRequest(...args);
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
