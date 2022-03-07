# Changelog


## [1.2.0](https://github.com/supercharge/request-ip/compare/v1.1.2...v1.2.0) - 2022-03-07

### Updated
- bump dependencies
- prefer the IP address from `request.socket` over `request.connection`
    - `request.connection` is deprecated since Node.js v13.0.0
- move tests from @hapi/lab and @hapi/code to jest


## [1.1.2](https://github.com/supercharge/request-ip/compare/v1.1.1...v1.1.2) - 2020-08-21

### Updated
- bump dependencies
- change `main` entrypoint in `package.json` to `dist` folder

### Removed
- remove `index.js` file which acted as a middleman to export from `dist` folder


## [1.1.1](https://github.com/supercharge/request-ip/compare/v1.1.0...v1.1.1) - 2020-08-11

### Fixed
- changed package exports to explicit, named exports. This addresses issue with bundlers like rollup


## [1.1.0](https://github.com/supercharge/request-ip/compare/v1.0.0...v1.1.0) - 2020-08-11

### Added
- default export to make the exports seamlessly work in ES modules


## 1.0.0 - 2020-08-04

### Added
- `1.0.0` release 🚀 🎉
