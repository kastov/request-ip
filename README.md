<div align="center">
  <h1>Request IP</h1>
  <p>
    Retrieve a request's IP address with custom header support
  </p>
  <br/>
  <p>
    <a href="#installation"><strong>Installation</strong></a> ·
    <a href="#usage"><strong>Usage</strong></a> ·
    <a href="#custom-headers"><strong>Custom Headers</strong></a> ·
    <a href="#detecting-the-ip-address"><strong>Detecting the IP Address</strong></a>
  </p>
  <br/>
  <br/>
  <p>
    <a href="https://www.npmjs.com/package/@kastov/request-ip"><img src="https://img.shields.io/npm/v/@kastov/request-ip.svg" alt="Latest Version"></a>
    <a href="https://www.npmjs.com/package/@kastov/request-ip"><img src="https://img.shields.io/npm/dm/@kastov/request-ip.svg" alt="Monthly downloads"></a>
  </p>
</div>

---

## Introduction

The `@kastov/request-ip` package provides a function to retrieve a request's IP address with support for custom headers prioritization.

## Installation

```bash
npm i @kastov/request-ip
```

## Usage

### Basic Usage

```js
const { getClientIp } = require('@kastov/request-ip');

const ip = getClientIp(request);

// for example '213.211.254.97' as an IP v4 address
// or '2001:0db8:85a3:0000:0000:8a2e:0370:7334' as an IP v6 address
// or 'undefined' if no IP address is available on the given request
```

### TypeScript Usage

```typescript
import { getClientIp } from '@kastov/request-ip';

const ip: string | undefined = getClientIp(request);
```

### Framework Examples

**Express.js middleware:**

```js
const { getClientIp } = require('@kastov/request-ip');

const expressMiddleware = function (req, res, next) {
  req.ip = getClientIp(req);
  next();
};
```

**Hapi.js route handler:**

```js
const Hapi = require('@hapi/hapi');
const { getClientIp } = require('@kastov/request-ip');

const server = new Hapi.Server({
  host: 'localhost',
});

server.route({
  method: 'GET',
  path: '/login',
  handler: (request, h) => {
    const ip = getClientIp(request);
    return h.response(ip);
  },
});
```

## Custom Headers

You can now prioritize custom headers when detecting IP addresses by using the `prependCustomHeaders` parameter:

```js
const { getClientIp } = require('@kastov/request-ip');

// Prioritize custom headers before standard ones
const customHeaders = ['my-custom-ip-header', 'another-custom-header'];
const ip = getClientIp(request, customHeaders);
```

### Custom Headers Examples

**Prioritize a specific proxy header:**

```js
const ip = getClientIp(request, ['x-original-forwarded-for']);
```

**Multiple custom headers with priority order:**

```js
// Will check headers in this order: custom-client-ip, proxy-real-ip, then standard headers
const ip = getClientIp(request, ['custom-client-ip', 'proxy-real-ip']);
```

**TypeScript with custom headers:**

```typescript
import { getClientIp } from '@kastov/request-ip';

const customHeaders: string[] = ['x-custom-ip', 'x-proxy-ip'];
const ip: string | undefined = getClientIp(request, customHeaders);
```

### Custom Headers Behavior

- Custom headers are checked **before** all standard headers
- Headers are processed in the order you specify in the array
- If a custom header contains an invalid IP, the next custom header is tried
- If all custom headers fail, the standard header detection order is used
- Custom headers support comma-separated values (like `x-forwarded-for`)
- Header names are case-insensitive

## Detecting the IP Address

The client's IP address may be stored in different locations of the request instance varying between services.

Here's the order of locations in which the package searches for the requesting IP address:

1. **Custom headers** (if `prependCustomHeaders` parameter is provided)
   - Headers are checked in the order you specify
   - Supports comma-separated values and port removal
   - Falls back to standard headers if no valid IP is found

2. **Standard HTTP request headers**
   1. `x-forwarded-for`: this header may contain multiple IP addresses for (client/proxies/hops). This package extracts and returns the first IP address.
   2. `x-forwarded`, `forwarded`, `forwarded-for` as variants from `x-forwarded-for` possibly configured by proxies
   3. `x-client-ip` possibly configured by nginx
   4. `x-real-ip` possibly configured in nginx
   5. `cf-connecting-ip` from Cloudflare
   6. `fastly-client-ip` from Fastly and Firebase
   7. `true-client-ip` from Akamai and Cloudflare
   8. `x-cluster-client-ip` from Rackspace

3. **Connection and socket information**
   - `request.connection.remoteAddress`
   - `request.connection.socket.remoteAddress`
   - `request.socket.remoteAddress`

4. **Framework-specific properties**
   - `request.info.remoteAddress` (Hapi.js)
   - `request.raw` (recursive check for frameworks like Fastify)
   - `request.requestContext.identity.sourceIp` (AWS API Gateway/Lambda)

## Credits

This package is a fork and enhancement of the excellent work by:

- **[Supercharge Team](https://github.com/supercharge/)** for the [@supercharge/request-ip](https://github.com/supercharge/request-ip) package
- **[Petar Bojinov](https://github.com/pbojinov)** for the original [request-ip](https://github.com/pbojinov/request-ip) package

### What's New in This Fork

- ✨ **Custom Headers Support**: Prioritize custom headers with `prependCustomHeaders` parameter
- 🔧 **TypeScript Support**: Full TypeScript implementation with proper type definitions
- 🧪 **Enhanced Testing**: Comprehensive test suite with 17+ additional test cases for custom headers
- 🐛 **Bug Fixes**: Fixed issues in the original `fromCustomHeaders` implementation

## Contributing

Missing a feature or found a bug? Contributions are welcome! Please send in a pull request 😊

1.  Create a fork
2.  Create your feature branch: `git checkout -b my-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request 🚀

## License

MIT © [Supercharge](https://superchargejs.com)

---

> [superchargejs.com](https://superchargejs.com) &nbsp;&middot;&nbsp;
> GitHub [@supercharge](https://github.com/supercharge/) &nbsp;&middot;&nbsp;
> Twitter [@superchargejs](https://twitter.com/superchargejs)
