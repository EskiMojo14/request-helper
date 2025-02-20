import { describe, it, expect } from "vitest";
import type { BodylessHttpMethod, BodyHttpMethod, HttpMethod } from "./types";
import { HttpRequest, JsonRequest } from ".";

describe("JsonRequest", () => {
  it("creates a request with json body, defaulting to POST", async () => {
    const body = { foo: "bar" };
    const request = new JsonRequest("https://example.com/", body);
    expect(request.url).toBe("https://example.com/");
    expect(request.method).toBe("POST");
    expect(request.headers.get("content-type")).toBe("application/json");
    await expect(request.clone().text()).resolves.toBe(JSON.stringify(body));
    await expect(request.json()).resolves.toEqual(body);
  });
  it("allows overriding method", () => {
    const body = { foo: "bar" };
    const request = new JsonRequest("https://example.com/", body, {
      method: "PUT",
    });
    expect(request.method).toBe("PUT");
  });
  it("throws if method is not a body method", () => {
    expect(() => {
      new JsonRequest(
        "https://example.com/",
        { foo: "bar" },
        { method: "GET" as never },
      );
    }).toThrowError(new TypeError("Method GET cannot have a body"));
  });
  it("has a static json method", () => {
    expect(JsonRequest).toHaveProperty("json", expect.typeOf("function"));
    expect(
      JsonRequest.json("https://example.com/", { foo: "bar" }),
    ).toBeInstanceOf(JsonRequest);
  });
  it("allows passing replacer to JSON.stringify", async () => {
    const body = { foo: "bar", baz: "qux" };
    const request = new JsonRequest("https://example.com/", body, {
      replacer: ["foo"],
    });
    await expect(request.text()).resolves.toBe(
      JSON.stringify({ foo: "bar", baz: "qux" }, ["foo"]),
    );
  });
});

type MethodDict<Methods extends HttpMethod> = {
  [Method in Methods]: Lowercase<Method>;
};

describe("HttpRequest", () => {
  describe.each(
    Object.entries({
      GET: "get",
      HEAD: "head",
      OPTIONS: "options",
      CONNECT: "connect",
      TRACE: "trace",
    } satisfies MethodDict<BodylessHttpMethod>),
  )("bodyless method %s", (method, helper) => {
    it(`exposes ${helper} helper`, () => {
      expect(HttpRequest).toHaveProperty(helper, expect.typeOf("function"));
    });
    // not supported
    if (method !== "CONNECT" && method !== "TRACE") {
      it("creates a request with method", () => {
        const request = HttpRequest[helper]("https://example.com/");
        expect(request.url).toBe("https://example.com/");
        expect(request.method).toBe(method);
      });
    }
  });
  describe.each(
    Object.entries({
      POST: "post",
      PUT: "put",
      DELETE: "delete",
      PATCH: "patch",
    } satisfies MethodDict<BodyHttpMethod>),
  )("body method %s", (method, helper) => {
    it(`exposes ${helper} helper`, () => {
      expect(HttpRequest).toHaveProperty(helper, expect.typeOf("function"));
    });
    it("creates a request with method", () => {
      const request = HttpRequest[helper]("https://example.com/");
      expect(request.url).toBe("https://example.com/");
      expect(request.method).toBe(method);
    });
    it("exposes json helper", () => {
      expect(HttpRequest[helper]).toHaveProperty(
        "json",
        expect.typeOf("function"),
      );
    });
    it("creates a request with json body", async () => {
      const body = { foo: "bar" };
      const request = HttpRequest[helper].json("https://example.com/", body);
      expect(request.url).toBe("https://example.com/");
      expect(request.method).toBe(method);
      expect(request.headers.get("content-type")).toBe("application/json");
      await expect(request.clone().text()).resolves.toBe(JSON.stringify(body));
      await expect(request.json()).resolves.toEqual(body);
    });
  });
});
