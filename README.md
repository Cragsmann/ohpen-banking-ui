# Multi-Tenant Next.js Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), enhanced to support multi-tenant routing using middleware.

---

## Features

- **Multi-Tenant Architecture:** Tenants are identified via subdomains.
- **Tenant + Label Support:** Supports URLs structured as `tenant.label.example.com` to allow tenant and branch/label separation.
- **Middleware-based Routing:** Incoming requests are intercepted by Next.js middleware which rewrites routes dynamically based on the tenant and label subdomains.
- **Mocked Authentication:** Simple mocked login and logout flows with protected routes.
- **Custom Tenant Configuration:** Load tenant-specific settings from Redis or other storage.
- **Flexible Environment Handling:** Works both in local development (`localhost`) and production environments.

---

## Project Structure Highlights

- **`middleware.ts`**  
  Detects tenant and optional label from the subdomain and rewrites requests to tenant-aware routes, e.g.  
  `https://tenant.label.example.com/path` → `/tenant/tenant/label/path`

- **Tenant Pages**  
  Under `/app/tenant/[tenant]/[label]/` and `/app/tenant/[tenant]/` for tenant-specific UI.

- **AuthProvider**  
  A React context provider for handling mocked user authentication and route protection.

---

## Getting Started

### Installation

```bash
npm install
# or
yarn
# or
pnpm install
```

### Run Dev server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Open browser on

http://localhost:3000
