import { describe, it, expect } from "vitest";
import { mergeHeaders, mergeRequestInits } from "./http";

describe("mergeHeaders", () => {
  it("merges headers", () => {
    const headers = mergeHeaders(
      { "content-type": "application/json", "x-foo": "bar" },
      { "content-type": "application/xml" },
    );
    expect(headers.get("content-type")).toBe("application/xml");
    expect(headers.get("x-foo")).toBe("bar");
  });
  it("ignores undefined", () => {
    const headers = mergeHeaders(
      { "content-type": "application/json" },
      undefined,
    );
    expect(headers.get("content-type")).toBe("application/json");
  });
});

describe("mergeRequestInits", () => {
  it("merges request inits", () => {
    const init = mergeRequestInits(
      { method: "POST", headers: { "content-type": "application/json" } },
      { headers: { "x-foo": "bar" } },
    );
    expect(init.method).toBe("POST");
    expect(init.headers.get("content-type")).toBe("application/json");
    expect(init.headers.get("x-foo")).toBe("bar");
  });
  it("ignores undefined", () => {
    const init = mergeRequestInits({ method: "POST" }, undefined);
    expect(init.method).toBe("POST");
  });
});
