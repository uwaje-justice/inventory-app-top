# Motiv — Inventory Management App

## Product Requirements Document (PRD)

### 1. Overview

**Motiv** is a full-stack inventory management application for vehicle parts. It allows individual users to create, manage, and track their own categories, items, suppliers, and vehicles. Each user has a private, isolated inventory — no data is shared between accounts. The system consists of an Express REST API backend, a PostgreSQL database (Prisma Postgres), and a React frontend.

### 2. Goals

- Provide a clean, intuitive interface for managing vehicle part inventory
- Support full CRUD operations for Categories, Items, Suppliers, and Vehicles
- Enable many-to-many relationships between Items and Vehicles (compatibility)
- Protect write operations behind JWT authentication
- Deploy to a production environment

### 3. Target Users

- Auto parts shop employees/managers
- Warehouse inventory staff
- Vehicle maintenance teams tracking compatible parts

### 4. Technical Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   React UI   │────▶│  Express API │────▶│Prisma Postgres│
│  (Frontend)  │     │  (Backend)   │     │  (Managed PG) │
└──────────────┘     └──────────────┘     └──────────────┘
```

| Layer | Technology | Details |
|---|---|---|
| Frontend | React | Consumes REST API, client-side routing |
| UI Library | Material UI (MUI) | Component library for consistent, polished UI |
| Backend | Express 5 (ESM) | REST API, JWT auth via Passport.js |
| ORM | Prisma 7.x | Driver adapter pattern with `@prisma/adapter-pg` |
| Database | Prisma Postgres | Managed PostgreSQL by Prisma, integrated with Prisma ORM |
| Auth | JWT + Passport.js | Bearer token, bcrypt for password hashing |
| Validation | express-validator | Request body/query/param validation |

### 5. Database Schema

#### 5.1 Entity Relationship Diagram

```
User ──1:N──▶ Category ──1:N──▶ Item ◀──N:M──▶ Vehicle
                 │                │
                 │                │
              userId           Supplier
```

All entities (Category, Item, Supplier, Vehicle) belong to a User via `userId` FK. Each user only sees and manages their own data.

#### 5.2 Models

**Category**
| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| name | String | not null |
| description | String | optional |
| userId | UUID | FK → User, not null |
| createdAt | DateTime | default now() |
| updatedAt | DateTime | auto-updated |

**Item**
| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| name | String | not null |
| description | String | optional |
| price | Decimal(10,2) | not null |
| quantity | Integer | not null, default 0 |
| categoryId | UUID | FK → Category, not null |
| supplierId | UUID | FK → Supplier, optional |
| userId | UUID | FK → User, not null |
| createdAt | DateTime | default now() |
| updatedAt | DateTime | auto-updated |

**Supplier**
| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| name | String | not null |
| contactName | String | optional |
| email | String | optional |
| phone | String | optional |
| userId | UUID | FK → User, not null |
| createdAt | DateTime | default now() |
| updatedAt | DateTime | auto-updated |

**Vehicle**
| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| make | String | not null |
| model | String | not null |
| year | Integer | not null |
| userId | UUID | FK → User, not null |
| createdAt | DateTime | default now() |
| updatedAt | DateTime | auto-updated |

**ItemVehicle** (join table — many-to-many)
| Field | Type | Constraints |
|---|---|---|
| itemId | UUID | FK → Item, composite PK |
| vehicleId | UUID | FK → Vehicle, composite PK |

**User**
| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| username | String | unique, not null |
| email | String | unique, not null |
| password | String | not null (bcrypt hashed) |
| createdAt | DateTime | default now() |
| updatedAt | DateTime | auto-updated |

#### 5.3 Delete Behavior

| Parent | Child | Behavior |
|---|---|---|
| User | All entities | **Cascade delete** — deleting a user deletes all their categories, items, suppliers, vehicles, and join table entries |
| Category | Items | **Cascade delete** — deleting a Category deletes all its Items (and their Vehicle associations via join table) |
| Supplier | Items | **Set null** — Items remain, supplierId becomes null |
| Item | ItemVehicle entries | **Cascade delete** — removing an Item cleans up join table rows |

### 6. API Endpoints

#### 6.1 Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create user account |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |

#### 6.2 Categories
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/categories` | Yes | List user's categories |
| GET | `/api/categories/:id` | Yes | Get category with its items |
| POST | `/api/categories` | Yes | Create category |
| PUT | `/api/categories/:id` | Yes | Update category |
| DELETE | `/api/categories/:id` | Yes | Delete category (cascades to items) |

#### 6.3 Items
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/items` | Yes | List user's items (with filters) |
| GET | `/api/items/:id` | Yes | Get single item with details |
| POST | `/api/items` | Yes | Create item |
| PUT | `/api/items/:id` | Yes | Update item |
| DELETE | `/api/items/:id` | Yes | Delete item |

#### 6.4 Suppliers
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/suppliers` | Yes | List user's suppliers |
| GET | `/api/suppliers/:id` | Yes | Get supplier with their items |
| POST | `/api/suppliers` | Yes | Create supplier |
| PUT | `/api/suppliers/:id` | Yes | Update supplier |
| DELETE | `/api/suppliers/:id` | Yes | Delete supplier (sets item supplierId to null) |

#### 6.5 Vehicles
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/vehicles` | Yes | List user's vehicles |
| GET | `/api/vehicles/:id` | Yes | Get vehicle with compatible items |
| POST | `/api/vehicles` | Yes | Create vehicle |
| PUT | `/api/vehicles/:id` | Yes | Update vehicle |
| DELETE | `/api/vehicles/:id` | Yes | Delete vehicle |
| POST | `/api/vehicles/:id/items` | Yes | Add compatible items to vehicle |
| DELETE | `/api/vehicles/:id/items/:itemId` | Yes | Remove item compatibility |

### 7. Frontend Pages

| Route | Component | Auth | Description |
|---|---|---|---|
| `/` | Landing | No | Marketing/hero page — app intro, call to action to sign in or register |
| `/login` | LoginForm | No | User login |
| `/register` | RegisterForm | No | User registration |
| `/dashboard` | Dashboard | Yes | User's own inventory overview — category cards, recent items, stats |
| `/categories` | CategoryList | Yes | User's own categories |
| `/categories/:id` | CategoryDetail | Yes | Category info + items in it |
| `/items` | ItemList | Yes | User's own items (filterable) |
| `/items/:id` | ItemDetail | Yes | Full item details + compatible vehicles |
| `/suppliers` | SupplierList | Yes | User's own suppliers |
| `/suppliers/:id` | SupplierDetail | Yes | Supplier info + their items |
| `/vehicles` | VehicleList | Yes | User's own vehicles |
| `/vehicles/:id` | VehicleDetail | Yes | Vehicle info + compatible items |
| `/categories/new` | CategoryForm | Yes | Create category |
| `/categories/:id/edit` | CategoryForm | Yes | Edit category |
| `/items/new` | ItemForm | Yes | Create item |
| `/items/:id/edit` | ItemForm | Yes | Edit item |
| `/suppliers/new` | SupplierForm | Yes | Create supplier |
| `/suppliers/:id/edit` | SupplierForm | Yes | Edit supplier |
| `/vehicles/new` | VehicleForm | Yes | Create vehicle |
| `/vehicles/:id/edit` | VehicleForm | Yes | Edit vehicle |

### 8. Authentication & Authorization

- **All endpoints require authentication** except register and login
- **Private inventory:** Each user only sees and manages their own data — all queries are scoped to `req.user.id`
- **No roles:** Every registered user has full CRUD access to their own inventory
- **Password storage:** bcrypt hashing (cost factor 10+)
- **JWT flow:** Register → login → receive token → send as `Authorization: Bearer <token>` header
- **Data isolation:** User A can never see, modify, or delete User B's categories, items, suppliers, or vehicles

### 9. Seed Data

A seed script (`prisma/seed.js`) will populate the database with:
- 1 demo user (username: `demo`, email: `demo@motiv.com`, password: `password123`)
- 5+ categories (Engine, Brakes, Electrical, Suspension, Exhaust, etc.) — all owned by the demo user
- 15+ items across categories with realistic names, prices, quantities
- 3+ suppliers with contact info
- 5+ vehicles (different makes/models/years)
- Item-vehicle compatibility relationships

### 10. Deployment

| Service | Purpose |
|---|---|
| Prisma Postgres | Managed PostgreSQL database |
| Render / Railway | Express API hosting |
| Vercel / Netlify | React frontend hosting |

### 11. Stretch Goals (Future Phases)

| Feature | Description |
|---|---|
| Search | Full-text search across items, categories, suppliers |
| Dashboard stats | Total items, low-stock alerts, category breakdown charts |
| Bulk operations | Import/export CSV, bulk delete/update |
| Image uploads | Item photos via Supabase Storage or Cloudinary |
| Pagination | Server-side pagination for large datasets |
| Sorting | Sort by name, price, quantity, date |
| Low stock alerts | Notifications when item quantity drops below threshold |

### 12. Project Structure (Target)

```
inventory-app-top/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── lib/
│   │   │   ├── db.js
│   │   │   └── passport.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── categories.js
│   │   │   ├── items.js
│   │   │   ├── suppliers.js
│   │   │   └── vehicles.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── categoryController.js
│   │   │   ├── itemController.js
│   │   │   ├── supplierController.js
│   │   │   └── vehicleController.js
│   │   ├── middlewares/
│   │   │   ├── authenticate.js
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   └── utils/
│   │       ├── errors.js
│   │       └── sanitizeUser.js
│   └── package.json
└── frontend/          (React app)
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── api/
    │   └── App.jsx
    └── package.json
```
