# request-helper

Extra utilities for working with `Request` objects.

## `JsonRequest`

A class that extends `Request` with a `json` static method. This method creates a `Request` with a JSON body and `application/json` content type. HTTP method defaults to `POST` if not specified.

```ts
const request = JsonRequest.json("https://example.com/", { foo: "bar" });
// is like
const request = new Request("https://example.com/", {
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({ foo: "bar" }),
});
```

## `HttpRequest`

A class that extends `JsonRequest` with static methods for each HTTP method. These methods create a `Request` with the specified method. For methods that support a body, the `json` method is also available.

```ts
const request = HttpRequest.get("https://example.com/");
// is like
const request = new Request("https://example.com/", {
  method: "GET",
});
```

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
