# Changelog

## [1.2.0](https://github.com/novatorsoft/nestjs-notification-module/compare/v1.1.0...v1.2.0) (2026-05-04)

### Features

* add Sosyomaks SMS provider support ([d841185](https://github.com/novatorsoft/nestjs-notification-module/commit/d841185139d13e8db65cb062d0fc93dabb008f63))
* add Sosyomaks SMS request handling and response logging ([50a663a](https://github.com/novatorsoft/nestjs-notification-module/commit/50a663a9b7e631d6f8314d100eb03085bc25f2d3))
* add unit tests for SosyomaksService to validate SMS sending functionality ([f4744a4](https://github.com/novatorsoft/nestjs-notification-module/commit/f4744a4b9460af200a7ffd331b4eb19ac63bdd62))

### Bug Fixes

* update SosyomaksRequest DTO to require SDate and ExDate fields ([a2267b1](https://github.com/novatorsoft/nestjs-notification-module/commit/a2267b159039b7c0e83a9d10d533b95b12471e3a))

* Merge pull request #1 from novatorsoft/feature/add-sosyomaks-sms-provider (7c300e1)
* refactor: remove empty message validation and streamline SosyomaksService request handling (b9cedb7)
* refactor: simplify XML parsing and remove redundant response handling in SosyomaksService (47ab5b7)
* feat: add unit tests for SosyomaksService to validate SMS sending functionality (f4744a4)
* fix: update SosyomaksRequest DTO to require SDate and ExDate fields (a2267b1)
* feat: add Sosyomaks SMS request handling and response logging (50a663a)
* feat: add Sosyomaks SMS provider support (d841185)
* chore: sync license and package.json with root version (4ef6d55)

## [1.1.0](https://github.com/novatorsoft/nestjs-notification-module/compare/v1.0.0...v1.1.0) (2026-03-12)

### Features

* export email module in index file ([66298c3](https://github.com/novatorsoft/nestjs-notification-module/commit/66298c30b9d8889ffffb3519a4fc81d8d5269fa2))

## 1.0.0 (2025-12-26)

### Features

* create email module and smtp email provider ([4705a68](https://github.com/novatorsoft/nestjs-notification-module/commit/4705a68e46b4d03d32b77b2b01bd924e45c78e22))
* create mutlucell sms provider ([20a8a99](https://github.com/novatorsoft/nestjs-notification-module/commit/20a8a994aade6a995aeaf78e9ee4098e68768e46))
* create sendgrid email provider ([70c16d0](https://github.com/novatorsoft/nestjs-notification-module/commit/70c16d0799660a1d1a9e2129b29924fdd68e4152))
* implement SMS module with Mutlucell provider and configuration ([a94e3a1](https://github.com/novatorsoft/nestjs-notification-module/commit/a94e3a17817503e297aa3bbe34ada407c496eedb))
* setup lib ([9c674ed](https://github.com/novatorsoft/nestjs-notification-module/commit/9c674edfffb6b0a3cc6a1c9f52f2488b49015ebe))

### Bug Fixes

* add error logging in MutlucellService to improve debugging ([8bfe70c](https://github.com/novatorsoft/nestjs-notification-module/commit/8bfe70cd32036ae6d959114e30789c6866b68014))
