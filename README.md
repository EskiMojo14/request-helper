# request-helper

Extra utilities for working with `Request` objects.

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

## `HttpRequest`

A class that extends `Request` with static methods for each HTTP method. These methods create a `Request` with the specified method.

```ts
const request = HttpRequest.get("https://example.com/");
// is like
const request = new Request("https://example.com/", {
  method: "GET",
});
```

For methods that support a body, there is also a `json` helper that creates a `JsonRequest` with the specified method.

```ts
const request = HttpRequest.post.json("https://example.com/", { foo: "bar" });
// is like
const request = new Request("https://example.com/", {
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({ foo: "bar" }),
});
```

`HttpRequest.json` is also available for convenience, which is the same as `JsonRequest.json`.

```ts
const request = HttpRequest.json("https://example.com/", { foo: "bar" });
// is like
const request = new JsonRequest("https://example.com/", { foo: "bar" });
```
