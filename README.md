<div align="center">

# Vendor Management & Quotation System

**A production-grade platform that digitizes and automates the entire vendor quotation lifecycle — from request creation to offer comparison, approval workflows, and audit compliance.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](./LICENSE)

[Live Application](https://vendor-quotation.vercel.app) · [API Base URL](https://vendor-quotation-api.railway.app) · [Report a Bug](https://github.com/your-username/vendor-quotation-system/issues)

</div>

---

## Overview

The **Vendor Management & Quotation System** is a full-stack enterprise web application built to replace manual, email-based quotation processes with a structured, transparent, and auditable digital workflow.

Administrators publish quotation requests with deadlines; registered vendors submit competitive price offers; the system automatically enforces business rules — closing expired requests, rejecting non-selected offers upon approval, and logging every action for compliance. A PDF comparison report can be generated at any point to support data-driven decision making.

---

## Features

### Administrator Portal
- Create, edit, publish, and close quotation requests with configurable deadlines
- Review all vendor offers on a unified comparison view and export as a formatted PDF report
- One-click offer approval with automatic rejection of all competing offers for the same request
- Full vendor lifecycle management — onboard, update, suspend, or remove vendor accounts
- Activity & audit log viewer with advanced filtering by action type, user, and date range
- Real-time dashboard with aggregate stats: active requests, pending offers, vendor count, and recent events

### Vendor Portal
- Self-service registration with company profile (name, contact, category, location)
- Browse all published, open quotation requests with deadline visibility
- Submit, revise, or retract price offers with reference document support
- Live offer status tracking — Pending, Approved, or Rejected
- Personal dashboard summarizing submitted offers, approval rate, and recent activity

### Platform-Wide
- Dark / Light mode toggle persisted across sessions via `localStorage`
- Fully responsive UI — desktop, tablet, and mobile
- Email notifications on offer approval and rejection via SMTP
- JWT-secured API with role-based access control enforced at both route and controller level
- Global error handling middleware with structured JSON error responses
- Activity logging middleware that captures every mutation event to a dedicated audit collection

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, Vite | UI framework and build tooling |
| **Styling** | Tailwind CSS 3 | Utility-first responsive design with dark mode |
| **HTTP Client** | Axios | API communication with JWT interceptor |
| **Backend** | Node.js, Express.js | RESTful API server |
| **Database** | MongoDB, Mongoose | Document storage and schema modeling |
| **Authentication** | JSON Web Tokens, bcrypt | Stateless auth, secure password hashing |
| **Email** | Nodemailer | Transactional SMTP notifications |
| **PDF** | Server-side PDF generation | Quotation comparison report export |
| **Deployment** | Vercel (frontend), Railway (backend) | Cloud hosting and CI/CD |

---

## Project Structure

```
vendor-quotation-system/
│
├── backend/
│   └── src/
│       ├── config/
│       │   ├── db.js                  # MongoDB connection
│       │   └── env.js                 # Environment variable loader
│       │
│       ├── models/
│       │   ├── User.js                # User schema (email, password, role)
│       │   ├── VendorProfile.js       # Vendor company details
│       │   ├── QuotationRequest.js    # Requests (title, deadline, status)
│       │   ├── QuotationOffer.js      # Vendor offers (amount, reference, status)
│       │   └── ActivityLog.js         # Audit trail
│       │
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── vendor.controller.js
│       │   ├── request.controller.js  # Includes auto-close logic
│       │   ├── offer.controller.js    # Includes auto-reject on approval
│       │   ├── dashboard.controller.js
│       │   ├── activity.controller.js
│       │   └── pdf.controller.js
│       │
│       ├── routes/                    # auth · vendor · request · offer · dashboard · activity · pdf
│       ├── services/
│       │   ├── auth.service.js
│       │   └── email.service.js
│       ├── middleware/
│       │   ├── auth.middleware.js     # JWT verification
│       │   ├── role.middleware.js     # Role-based access (admin / vendor)
│       │   ├── error.middleware.js    # Global error handler
│       │   └── activity.middleware.js # Mutation event logger
│       ├── utils/
│       │   ├── jwt.js
│       │   └── hashPassword.js
│       ├── app.js
│       └── server.js
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js               # Axios instance with auth token interceptor
        ├── components/
        │   ├── Navbar.jsx             # Role-aware navigation
        │   ├── ProtectedRoute.jsx     # Auth + role route guard
        │   ├── ThemeToggle.jsx
        │   └── Loader.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ThemeContext.jsx
        ├── hooks/
        │   └── useAuth.js
        ├── pages/
        │   ├── auth/                  # Login · VendorRegister
        │   ├── admin/                 # Dashboard · Vendors · Requests · ActivityLogs
        │   ├── vendor/                # Dashboard · Requests · OfferForm
        │   ├── Home.jsx
        │   └── Compare.jsx
        └── utils/
            ├── helpers.js
            └── constants.js
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** — local instance or [MongoDB Atlas](https://cloud.mongodb.com) cluster
- An SMTP-capable email account (Gmail App Password recommended)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/vendor-quotation-system.git
cd vendor-quotation-system
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/vendor-quotation

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="Vendor System <no-reply@vendorquotation.com>"
```

Start the development server:

```bash
npm run dev
```

> The API will be available at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

> The app will be available at `http://localhost:5173`

---

## API Reference

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new vendor account |
| `POST` | `/api/auth/login` | Public | Authenticate and receive JWT |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |

### Vendors

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/vendors` | Admin | List all registered vendors |
| `POST` | `/api/vendors` | Admin | Create a new vendor record |
| `PUT` | `/api/vendors/:id` | Admin | Update vendor information |
| `DELETE` | `/api/vendors/:id` | Admin | Remove a vendor account |

### Quotation Requests

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/requests` | Authenticated | List all requests |
| `POST` | `/api/requests` | Admin | Create a new quotation request |
| `PUT` | `/api/requests/:id` | Admin | Update or close a request |
| `DELETE` | `/api/requests/:id` | Admin | Delete a request |

### Offers

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/offers` | Authenticated | List offers (scoped by role) |
| `POST` | `/api/offers` | Vendor | Submit a new offer |
| `PUT` | `/api/offers/:id` | Vendor | Update a pending offer |
| `PUT` | `/api/offers/:id/approve` | Admin | Approve offer; auto-rejects others |
| `DELETE` | `/api/offers/:id` | Vendor | Withdraw an offer |

### Dashboard, Activity & Reports

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/dashboard/stats` | Authenticated | Role-scoped dashboard statistics |
| `GET` | `/api/activities` | Admin | Paginated audit log with filters |
| `GET` | `/api/pdf/comparison/:requestId` | Admin | Download offer comparison PDF |

---

## Environment Variables

| Variable | Service | Required | Description |
|----------|---------|----------|-------------|
| `PORT` | Backend | Yes | HTTP server port |
| `NODE_ENV` | Backend | Yes | `development` or `production` |
| `MONGO_URI` | Backend | Yes | MongoDB connection string |
| `JWT_SECRET` | Backend | Yes | Signing secret (min. 32 characters) |
| `JWT_EXPIRES_IN` | Backend | Yes | Token lifetime (e.g. `7d`, `24h`) |
| `EMAIL_HOST` | Backend | Yes | SMTP server hostname |
| `EMAIL_PORT` | Backend | Yes | SMTP port (587 for TLS) |
| `EMAIL_USER` | Backend | Yes | Sender email address |
| `EMAIL_PASS` | Backend | Yes | SMTP password or app-specific password |
| `EMAIL_FROM` | Backend | Yes | Display name and address for outgoing mail |
| `VITE_API_URL` | Frontend | Yes | Backend API base URL |

> **Security:** `.env` files are excluded from version control via `.gitignore`. Never commit secrets to a repository.

---

## Deployment

### Frontend — Vercel

1. Push the repository to GitHub.
2. Import the project at [vercel.com](https://vercel.com/new).
3. Set the **Root Directory** to `frontend`.
4. Add `VITE_API_URL` pointing to your production backend URL under **Environment Variables**.
5. Deploy. Vercel handles builds automatically on every push to `main`.

### Backend — Railway

1. Create a new project at [railway.app](https://railway.app).
2. Connect the GitHub repository and set the **Root Directory** to `backend`.
3. Add all backend environment variables under **Variables**.
4. Set the **Start Command** to `node src/server.js`.
5. Provision a MongoDB service or connect an Atlas URI via `MONGO_URI`.

---

## Architecture Decisions

**Monorepo layout** — frontend and backend coexist in a single repository, simplifying local development and keeping deployment configuration co-located with source code.

**Auto-reject on approval** — approving one vendor's offer atomically sets all competing offers on the same request to `rejected` and dispatches email notifications, eliminating any manual follow-up.

**Auto-close on deadline** — a scheduled check on request retrieval marks expired requests as `closed`, preventing vendors from submitting offers after the deadline without requiring a separate cron infrastructure.

**Middleware-level activity logging** — rather than scattering log calls throughout controllers, a dedicated Express middleware intercepts mutation requests and writes structured events to the `ActivityLog` collection, ensuring consistent and tamper-evident audit records.

**Role-scoped API responses** — dashboard stats, offer lists, and activity feeds are filtered server-side based on the authenticated user's role, so vendors never receive data outside their scope regardless of client-side routing.

---

## Author

<table>
  <tr>
    <td><strong>Muhammad Sami</strong></td>
  </tr>
  <tr>
    <td>BS Software Engineering — Superior University Lahore (2024–2028)</td>
  </tr>
  <tr>
    <td>Full-Stack Web Developer Intern @ TEYZIX CORE</td>
  </tr>
</table>

[![GitHub](https://img.shields.io/badge/GitHub-your--username-181717?style=flat-square&logo=github)](https://github.com/your-username)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Muhammad%20Sami-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/your-profile)

---

## License

© 2024 Muhammad Sami — Built as part of an internship deliverable at **TEYZIX CORE**. All rights reserved.