# Ghost-Environment

> **Zero-Config Dynamic Microservice Mocker & Chaos Engineering Proxy**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind_css&logoColor=white)](https://tailwindcss.com/)

---

## The Breakpoint
Modern distributed microservice architectures create massive development bottlenecks:
* **Heavy Dependency Chains:** Frontend and backend developers are forced to run multiple unrelated services locally, overwhelming machine memory.
* **Stale Static Mocks:** Manually maintained Postman or JSON mocks quickly drift out of sync with actual OpenAPI specifications.
* **Untested Resilience:** Edge-case network conditions (latency spikes, server crashes) are rarely tested locally until they fail in production.

---

## The Solution
**Ghost-Environment** is a lightweight, zero-configuration local proxy. When an upstream service is missing or offline, Ghost-Environment intercepts the call, parses the central OpenAPI/Swagger specification, and generates dynamically typed, context-aware dummy responses on the fly.

### Key Features
* **Schema-Driven Dynamic Generation:** Automatically maps data types, property names (`email`, `uuid`, `firstName`), and nested arrays using `@faker-js/faker`.
* **Zero-Drift Synchronization:** Always serves responses matching the latest OpenAPI contract.
* **Built-in Chaos Mode:** Injects random network latency ($300\text{ ms} - 2500\text{ ms}$) and simulates server drops ($500/503$) to test client-side resilience and fallback states.
* **Visual Telemetry Dashboard:** A real-time client UI to monitor response latency, HTTP status codes, and JSON payloads.

---

## Architecture Overview
