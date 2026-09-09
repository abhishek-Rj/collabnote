# CollabNote

CollabNote is a high-performance, real-time collaborative document editing platform. Built with a Next.js 16 (React 19) frontend and a Go (Gin + GORM + PostgreSQL) backend, CollabNote delivers co-authoring, workspace management, role-based document permissions, and shareable invite links.

---

## Features

- **CRDT-Based Real-Time Collaboration**: Resolves concurrent editing conflicts across multiple users without server lockouts or merge conflicts.
- **Go (Gin) REST Backend**: High-concurrency Go server powered by Gin & GORM with PostgreSQL.
- **Dark Tech Aesthetic**: Monospace technical UI styling with custom status indicators.
- **Document Workspace**: Overview of all documents you own or have joined as a co-author.
- **4-Second Debounced Autosave**: Intelligent autosave that defers updates until 4 seconds after your last keypress to prevent unnecessary server load—plus a manual instant Save override.
- **Interactive Save Indicator**: Header button displaying real-time state (`Save` -> `Saving...` -> `Saved`).
- **Granular Permission Enforcement**:
  - Strict role checks (`Owner`, `Write`, `Read`).
  - Unauthorized access attempts trigger a `403 Forbidden` screen with an automated redirect back to the workspace.
- **Document Sharing & Invite Links**:
  - Generate shareable invite URLs (`/join/[code]`) with customizable permissions (Can Edit vs Can View).
  - Unauthenticated recipients are redirected to sign in before automatically joining the document session.

---

## Real-Time Collaboration via CRDT

### The Problem CRDT Solves

In collaborative editing, multiple peers can edit the same document concurrently over unreliable networks with variable latency. Traditional approaches rely on centralized document locking (which blocks users from editing simultaneously) or Last-Write-Wins (which overwrites concurrent changes and drops data). Centralized Operational Transformation (OT) requires a central server to coordinate and transform operational indices, adding latency and complexity.

Conflict-Free Replicated Data Types (CRDTs) solve this problem by providing strong eventual consistency. Edits are modeled as commutative operations on a distributed data structure. Every peer can apply edits locally and optimistically without waiting for server confirmation, and updates can be received and merged in any order across peers while converging to the exact same document state without data loss.

### Current Implementation & Migration Plan

CollabNote currently leverages **Yjs**, a high-performance CRDT ecosystem, to handle document state vectors, remote change integration, and awareness. 

As part of the technical roadmap, the project is planning to migrate from Yjs to a custom-built, in-house CRDT implementation. A dedicated engine will enable tailored low-level vector optimizations, deeper integration with the Go backend and WebSocket layer, lower memory footprints, and domain-specific state persistence tailored to CollabNote.

---

## Tech Stack & Architecture

```
collabnote/
├── app/                        # Next.js 16 (App Router) Frontend
│   ├── auth/                   # Server-side Session Helper
│   ├── components/             # Client Components (WorkspaceClient, DocumentClient, JoinClient)
│   ├── join/[code]/            # Public Invite Join Landing Route
│   ├── login/                  # Authentication Login Route
│   ├── signup/                 # Account Registration Route
│   └── workspace/              # User Workspace & Document Routes
│
└── backend/                    # Go (Gin + GORM) REST API Server
    ├── cmd/server/main.go      # Server Entry Point
    ├── config/                 # Environment Configuration
    ├── database/               # PostgreSQL GORM Schema Models
    ├── middleware/             # JWT Authentication Middleware
    ├── routes/                 # Auth & Document Route Handlers
    └── tokens/                 # JWT Access/Refresh Token Generators
```

---

## Setup & Installation

Setting up full-stack applications with dual Go/Node runtimes and a relational database requires configuring both servers and the database instance. Follow these steps to set up CollabNote locally.

### Prerequisites

Ensure you have the following installed on your system:
- Go (v1.22 or higher)
- Node.js (v18.0 or higher) & npm
- PostgreSQL database service running locally or remotely

---

### Step 1: Database Setup (PostgreSQL)

CollabNote requires a PostgreSQL database instance.

1. Start your local PostgreSQL service:
   ```bash
   sudo systemctl start postgresql  # Linux
   # or via Postgres App / Homebrew on macOS
   ```
2. Log into the PostgreSQL shell:
   ```bash
   psql -U postgres
   ```
3. Create the database:
   ```sql
   CREATE DATABASE collabnote;
   ```

---

### Step 2: Backend Configuration & Startup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Copy the sample environment template `.env.sample` to `.env`:
   ```bash
   cp .env.sample .env
   ```
3. Edit `backend/.env` with your PostgreSQL database credentials and JWT secrets:
   ```env
   APP_PORT="8080"
   DB_HOST="localhost"
   DB_PORT="5432"
   DB_USER="postgres"
   DB_PASSWORD="your_postgres_password"
   DB_NAME="collabnote"
   JWT_ACCESS_TOKEN="super_secret_access_key_change_me"
   JWT_REFRESH_TOKEN="super_secret_refresh_key_change_me"
   BCRYPT_SALT=10
   ```
4. Install Go dependencies:
   ```bash
   go mod download
   ```
5. Start the Go backend server:
   ```bash
   go run ./cmd/server/main.go
   ```
   > The server will execute GORM auto-migrations and listen for requests on port 8080.

---

### Step 3: Frontend Configuration & Startup

1. Return to the project root directory:
   ```bash
   cd ..
   ```
2. Copy the sample environment template `.env.sample` to `.env.local`:
   ```bash
   cp .env.sample .env.local
   ```
3. Install Node packages:
   ```bash
   npm install
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

---

## Troubleshooting & Edge Cases

### 1. "unauthorized" HTTP 401 on Document Creation / Fetching
- Ensure your browser permits cookies between `localhost:3000` and `localhost:8080`.
- Always access both frontend and backend using `localhost` (or both using `127.0.0.1`). Mixing `127.0.0.1:3000` with `localhost:8080` can cause browsers to drop `HTTP-Only` cross-origin cookies.

### 2. GORM PostgreSQL Connection Failures
- Verify PostgreSQL is running (`pg_isready`).
- Double-check `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `backend/.env`.

### 3. Production Build Verification
- Test TypeScript compilation and page generation prior to deployment:
  ```bash
  npm run build
  ```

---

## License

Distributed under the MIT License.
