# 🚀 Creator Marketplace API

An enterprise-grade, high-performance RESTful backend built for a creator economy platform. 

This project goes beyond standard CRUD operations, focusing heavily on **advanced PostgreSQL database engineering**, including ACID-compliant financial transactions, Common Table Expressions (CTEs) for single-trip analytics, and GIN-indexed trigram search.

## 🛠 Tech Stack
* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js
* **Database:** PostgreSQL
* **Driver:** `pg` (node-postgres) with Connection Pooling

## 🔥 Key Engineering Features

### 1. ACID-Compliant Financial Transactions
Implemented isolated database transactions (`BEGIN`, `COMMIT`, `ROLLBACK`) for the checkout engine. This guarantees that charging a buyer, crediting a creator, and recording a product delivery execute as a single, atomic operation, preventing data corruption or lost funds in the event of a server failure.

### 2. High-Performance Search (GIN & Trigrams)
Replaced inefficient database Sequential Scans with a **Generalized Inverted Index (GIN)** using the `pg_trgm` extension. This enables lightning-fast partial text searches (`ILIKE`) across millions of product records without spiking CPU load.

### 3. Single-Trip Analytics (CTEs)
Built a complex creator dashboard using **Common Table Expressions (WITH clauses)**. Instead of hitting the database multiple times to fetch disparate metrics, the backend aggregates Lifetime Revenue, Total Sales Count, and Top-Selling Product in a single, highly optimized database trip.

### 4. Dynamic Querying & Safe Pagination
Engineered a flexible `GET /api/products` storefront endpoint featuring dynamic limit/offset pagination and sorting. Implemented strict Javascript-level mapping for `ORDER BY` clauses to completely neutralize SQL injection vulnerabilities.

### 5. Router-Controller Architecture
Transitioned from a monolithic `server.js` file to a scalable, decoupled architecture, cleanly separating HTTP routing from database business logic.

---

## 📂 Architecture

```text
creator-marketplace-api/
│
├── database/
│   ├── db.js                 # PostgreSQL connection pool setup
│   └── schema.sql            # Table schemas, Trigram engine, GIN index setup
│
├── routes/
│   ├── userRoutes.js         # Express routers
│   ├── productRoutes.js      
│   ├── purchaseRoutes.js     
│   └── analyticsRoutes.js    
│
├── controllers/
│   ├── userController.js     # Database interactions & business logic
│   ├── productController.js  
│   ├── purchaseController.js 
│   └── analyticsController.js
│
└── server.js                 # Express entry point & middleware
