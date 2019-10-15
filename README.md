> This example repo is a fork of [serverless-webpack typescript example](https://github.com/serverless-heaven/serverless-webpack/tree/master/examples/typescript)

This repo is a demonstration of [this blog entry](https://todayilearned.io/til/full-stacktrace-for-async-await-node).

# Testing

## Before

```
╰ serverless invoke local -f hello
Serverless: Bundling with Webpack...
Starting type checking service...
Using 1 worker with 2048MB memory limit
Time: 2820ms
Built at: 10/15/2019 11:43:34 AM
             Asset      Size       Chunks                   Chunk Names
    src/handler.js  4.44 KiB  src/handler  [emitted]        src/handler
src/handler.js.map  4.67 KiB  src/handler  [emitted] [dev]  src/handler
Entrypoint src/handler = src/handler.js src/handler.js.map
[./src/handler.ts] 479 bytes {src/handler} [built]
Error: Something Bad
    at functionOne (/Workspace/github/andycmaj/node-stacktraces-example/.webpack/hello/src/webpack:/src/handler.ts:7:9)
{
    "message": "Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!",
    "event": ""
}
```

## Enable 

Uncomment the `plugins` line in [`.babelrc`](./.babelrc);

```js
  "plugins": ["./babel-plugin-await-full-stacktrace.js", "source-map-support"]
```

## After

```
╰ serverless invoke local -f hello
Serverless: Bundling with Webpack...
Starting type checking service...
Using 1 worker with 2048MB memory limit
Time: 3291ms
Built at: 10/15/2019 11:43:12 AM
             Asset      Size       Chunks                   Chunk Names
    src/handler.js  5.81 KiB  src/handler  [emitted]        src/handler
src/handler.js.map  4.92 KiB  src/handler  [emitted] [dev]  src/handler
Entrypoint src/handler = src/handler.js src/handler.js.map
[./src/handler.ts] 1.21 KiB {src/handler} [built]
[source-map-support/register] external "source-map-support/register" 42 bytes {src/handler} [built]
Error: Something Bad
    at functionOne (/Workspace/github/andycmaj/node-stacktraces-example/.webpack/hello/src/webpack:/src/handler.ts:7:9)
...
Error:
    at /Workspace/github/andycmaj/node-stacktraces-example/.webpack/hello/src/webpack:/src/handler.ts:11:3
    at /Workspace/github/andycmaj/node-stacktraces-example/.webpack/hello/src/webpack:/src/handler.ts:11:3
...
Error:
    at /Workspace/github/andycmaj/node-stacktraces-example/.webpack/hello/src/webpack:/src/handler.ts:16:5
    at /Workspace/github/andycmaj/node-stacktraces-example/.webpack/hello/src/webpack:/src/handler.ts:16:5
{
    "message": "Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!",
    "event": ""
}
```
