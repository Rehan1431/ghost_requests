# Ghost-Environment: Zero-Config Microservice Mocker

**Built for the Breakpoint Hackathon 2026 (Software & Developer Tools Track)**

## Overview
Modern software relies heavily on microservice architectures. When a frontend or backend developer attempts to test a single feature locally, they encounter a significant bottleneck: they must either manually maintain static mock files (which become outdated instantly) or spin up resource-intensive Docker containers for unrelated services just to avoid `ECONNREFUSED` network errors. 

**Ghost-Environment** solves the "works on my machine" problem by acting as a lightweight, intelligent local proxy. If a requested microservice is offline, the proxy intercepts the failure, reads the central OpenAPI 3.0 specification, and instantly generates a dynamic, realistic mock response on the fly.

## Architecture & Workflow

1. **Intercept:** Catches `ECONNREFUSED` network errors locally via `http-proxy-middleware`.
2. **Read:** Scans the provided `openapi.yaml` specification for the exact requested route and method.
3. **Generate:** Utilizes `@faker-js/faker` to dynamically construct a valid JSON payload that perfectly matches the required schema types.
4. **Serve:** Returns the payload to the client with a custom `X-Ghost-Environment: true` header to indicate the data was mocked.

[Insert Architecture Diagram Screenshot Here]

## System Requirements
- Node.js (v18 or higher)
- npm

## Installation & Setup

1. Clone the repository:
```bash
git clone [https://github.com/Rehan1431/ghost_requests.git](https://github.com/Rehan1431/ghost_requests.git)
cd ghost_requests
