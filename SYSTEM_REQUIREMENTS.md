# Ghost-Environment System Requirements

To ensure a smooth, error-free setup of the Ghost-Environment project on a fresh Windows machine, please verify that your system meets the following requirements.

## 1. System Prerequisites

- **Node.js**: v18.17.0 or v20.x (LTS recommended)
- **npm**: v9.x or v10.x (comes bundled with Node.js)
- **OS**: Windows 10/11 (or equivalent macOS/Linux environment)

## 2. Core Production Dependencies

These are required for the proxy server to intercept and mock API requests dynamically.

- `http-proxy-middleware`: ^3.0.0 (Required for v3 `on: { error }` event listener syntax)
- `express`: ^4.19.2
- `@apidevtools/swagger-parser`: ^10.1.0
- `@faker-js/faker`: ^8.4.1
- `openapi-types`: ^12.1.3

## 3. Development Dependencies

These tools are necessary for compiling TypeScript and running the development server.

- `typescript`: ^5.4.5
- `ts-node`: ^10.9.2
- `nodemon`: ^3.1.0
- `@types/express`: ^4.17.21
- `@types/node`: ^20.12.7

## 4. Verification Guide

Before installing the project packages via `npm install`, follow these 3 quick steps in your terminal (PowerShell or Command Prompt) to ensure your system software is correctly installed and accessible:

**Step 1: Verify Node.js version**
```powershell
node --version
# Expected Output: v18.x.x or v20.x.x
```

**Step 2: Verify npm version**
```powershell
npm --version
# Expected Output: 9.x.x or 10.x.x
```

**Step 3: Verify TypeScript execution tool (Optional but recommended)**
```powershell
npx ts-node --version
# Expected Output: v10.x.x
```

Once verified, you can confidently navigate to your project folder, run `npm install`, and start the server with `npm run dev`.
