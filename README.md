# Expense Tracker

A web app for tracking personal expenses with user registration and MySQL storage.

## Features

- **User accounts** – Register, login, logout
- **Add expenses** – Purpose, amount, date
- **Monthly summary** – Total expenses by month
- **Expense list** – View and delete expenses

## Tech Stack

- **Backend:** Node.js, Express, MySQL
- **Frontend:** React (Vite)
- **Auth:** JWT

## Prerequisites

- Node.js 18+
- MySQL 8+ (see [MYSQL_SETUP.md](./MYSQL_SETUP.md) for installation)

## Quick Start

### 1. Install MySQL

Follow [MYSQL_SETUP.md](./MYSQL_SETUP.md) to install and configure MySQL.

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure environment

Copy the example env and edit:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker

# JWT
JWT_SECRET=your-random-secret-at-least-32-chars

```



### 4. Run the app

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

The database and tables are created automatically on first run.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run backend + frontend |
| `npm run dev:backend` | Run backend only |
| `npm run dev:frontend` | Run frontend only |
| `npm run build` | Build frontend for production |
| `npm start` | Run backend in production |

## API Endpoints

### Auth
- `POST /api/auth/register` – Register (returns token, auto-login)
- `POST /api/auth/login` – Login
- `GET /api/auth/me` – Current user (requires token)

### Expenses
- `POST /api/expenses` – Add expense
- `GET /api/expenses?month=YYYY-MM` – List expenses
- `GET /api/expenses/summary?month=YYYY-MM` – Monthly total
- `DELETE /api/expenses/:id` – Delete expense
