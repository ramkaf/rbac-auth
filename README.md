# NestJS RBAC Authentication System

Backend built with NestJS, TypeORM, PostgreSQL, Redis, and JWT with Role-Based Access Control (RBAC) and dynamic permissions.

## Features

- JWT authentication (login / signup)
- Role-Based Access Control (RBAC)
- Dynamic, string-based permission system
- Wildcard permissions at the controller level
- Redis caching for roles/permissions
- Auto-seeding of users, roles, and permissions on startup
- Public route decorator (`@Public`) to bypass auth
- Swagger docs

## Default Users

| Role  | Email            | Password |
|-------|------------------|----------|
| Admin | admin@demo.com   | 123456   |
| User  | user@demo.com    | 123456   |

Admin has full access via a wildcard permission. Normal users are limited to whatever permissions their role has.

## Permissions

Permissions are plain strings, e.g. `user:read`, `user:create`, `sample-management:create`.

Wildcard example: `sample-management:*` grants access to every endpoint in that controller.

**Endpoint-level:**
```ts
@RequiresPermission("user:read")
@Get()
```

**Controller-level (wildcard):**
```ts
@ControllerPermission("sample-management:*")
@Controller("sample")
```

**Public route:**
```ts
@Public()
@Get()
```

## Managing Roles & Permissions

- Assign permissions to a role: via the Roles API
- Assign a role to a user: via the Users API

## Permission Auto-Seeding

Every file under `src/modules/rbac/constants/*.permission.ts` is scanned at startup, and any permission not already in the database is inserted automatically — no manual seeding needed.

## Request Flow

```
JWT Guard -> Permission Guard -> Controller
```

1. Login returns a JWT
2. JWT Guard validates the token
3. Permission Guard checks the user's role, its permissions, and any wildcard match
4. Request is allowed or rejected with 403

## Running the Project

```bash
docker-compose up -d
npm install
npm run start
```

Swagger UI: `http://localhost:3000/api`

## Module Import Order

```
AuthModule -> UsersModule <--> RBACModule
```

JWT Guard and Permission Guard must both be registered in modules.
