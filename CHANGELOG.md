# 1.0.0 (2026-05-01)


### Features

* initial SDK scaffold for ThreatLocker Portal API ([a928463](https://github.com/wyre-technology/node-threatlocker/commit/a928463044ebe7a41cb8d824aaaa2b3aa9aa40a8))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial SDK scaffold for ThreatLocker Portal API
- Support for Computers resource (list, get, getCheckins)
- Support for Computer Groups resource (list, getDropdown)
- Support for Approval Requests resource (list, get, getPendingCount, getPermitApplication)
- Support for Audit Log resource (search, get, getFileHistory)
- Support for Organizations resource (listChildren, getAuthKey, listForMoveComputers)
- Built-in rate limiting (10 req/sec default)
- Multi-tenant support with `childOrganizations` flag
- Beta environment support via configurable `baseUrl`
- Comprehensive error handling with structured error types
- TypeScript support with full type definitions
- Zero runtime dependencies (uses native fetch)

### Security

- Raw API key authentication (no Bearer prefix as required by ThreatLocker)
- Organization ID header support for multi-tenant scenarios
