# request-helper

Extra utilities for working with `Request` objects.

> [!WARNING]
> Requires support (or a polyfill) for `AbortSignal.any`.

## `JsonRequest`

A subclass of `Request` that automatically sets the `content-type` header to `application/json` and stringifies the body. Method defaults to `POST` if not specified, and throws if the method does not support a body.

```ts
const request = new JsonRequest(
  "https://example.com/",
  { foo: "bar" },
  { method: "PUT" },
);
// is like
const request = new Request("https://example.com/", {
  method: "PUT",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({ foo: "bar" }),
});
```

Also has a static `json` method which accepts the same arguments as the constructor, for consistency with `Response.json`.

```ts
const request = JsonRequest.json(
  "https://example.com/",
  { foo: "bar" },
  { method: "PUT" },
);
```

The `RequestInit` shape can also include a `replacer` argument, which is passed to `JSON.stringify` as the second argument.

```ts
const request = new JsonRequest(
  "https://example.com/",
  { foo: "bar", baz: "qux" },
  { replacer: ["foo"] },
);
// is like
const request = new Request("https://example.com/", {
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({ foo: "bar", baz: "qux" }, ["foo"]),
});
```

## `FormDataRequest`

A subclass of `Request` that automatically sets the body to the provided `FormData` object. (_Content-Type header is set automatically by browser_) Method defaults to `POST` if not specified, and throws if the method does not support a body.

```ts
const request = new FormDataRequest("https://example.com/", new FormData(), {
  method: "PUT",
});
// is like
const request = new Request("https://example.com/", {
  method: "PUT",
  body: new FormData(),
});
```

Also has a static `formData` method which accepts the same arguments as the constructor.

## `HttpRequest`

A class that extends `Request` with static methods for each HTTP method. These methods create a `Request` with the specified method.

```ts
const request = HttpRequest.get("https://example.com/");
// is like
const request = new Request("https://example.com/", { method: "GET" });
```

For methods that support a body, there is also a `json` helper that creates a `JsonRequest` with the specified method.

```ts
const request = HttpRequest.post.json("https://example.com/", { foo: "bar" });
// is like
const request = new JsonRequest(
  "https://example.com/",
  { foo: "bar" },
  { method: "POST" },
);
```

`HttpRequest.json` and `HttpRequest.formData` are also available for convenience.

```ts
const request = HttpRequest.json("https://example.com/", { foo: "bar" });
// is like
const request = new JsonRequest("https://example.com/", { foo: "bar" });
```

```ts
const request = HttpRequest.formData("https://example.com/", new FormData());
// is like
const request = new FormDataRequest("https://example.com/", new FormData());
```

## `mergeHeaderInits` and `mergeRequestInits`

Utility functions for merging header and request inits. These are used internally by the other helpers, but may be useful in other contexts.

```ts
const headers = mergeHeaderInits(
  { "content-type": "application/json", "x-foo": "bar" },
  { "content-type": "application/xml" },
);
// is like
const headers = new Headers();
headers.set("content-type", "application/json");
headers.set("x-foo", "bar");
headers.set("content-type", "application/xml");
```

```ts
const init = mergeRequestInits(
  {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: ac1.signal,
  },
  { headers: { "x-foo": "bar" }, signal: ac2.signal },
);
// is like
const init = {
  method: "POST",
  headers: mergeHeaderInits(
    { "content-type": "application/json" },
    { "x-foo": "bar" },
  ),
  signal: AbortSignal.any([ac1.signal, ac2.signal]),
};
```
