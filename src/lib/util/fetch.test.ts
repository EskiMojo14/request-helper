import { describe, it, expect } from "vitest";
import { mergeHeaderInits, mergeRequestInits } from "./fetch";

describe("mergeHeaderInits", () => {
  it("merges headers", () => {
    const headers = mergeHeaderInits(
      { "content-type": "application/json", "x-foo": "bar" },
      { "content-type": "application/xml" },
    );
    expect(headers.get("content-type")).toBe("application/xml");
    expect(headers.get("x-foo")).toBe("bar");
  });
  it("ignores undefined", () => {
    const headers = mergeHeaderInits(
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
  it("merges multiple signals", () => {
    const ac1 = new AbortController();
    const ac2 = new AbortController();
    const init = mergeRequestInits(
      { signal: ac1.signal },
      { signal: ac2.signal },
    );
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(init.signal?.aborted).toBe(false);
    ac1.abort();
    expect(init.signal?.aborted).toBe(true);
  });
  it("reuses single signal", () => {
    const ac1 = new AbortController();
    const init = mergeRequestInits({ signal: ac1.signal }, undefined);
    expect(init.signal).toBe(ac1.signal);
  });
});
