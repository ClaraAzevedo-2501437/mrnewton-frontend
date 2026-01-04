# MrNewton Activity Provider - Frontend

Frontend application for the MrNewton Activity Provider, built with React, TypeScript, and Vite.

## Overview

This frontend provides interfaces for:
- **Students**: Take quizzes with real-time evaluation
- **Teachers**: View analytics and manage activities

## Architecture

```
Browser (Port 3000)
    ↓ HTTP Requests (/api/*)
Vite Dev Server (Port 3000)
    ↓ Proxy (/api → /api/v1)
Activity Backend (Port 5000)
```

## Tech Stack

- **React 18.2** - UI framework
- **TypeScript** - Type safety
- **Vite 5.0** - Build tool and dev server
- **Zustand** - State management
- **Axios** - HTTP client
- **mathjs** - Mathematical expression evaluation
- **React Router** - Routing

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

**Prerequisites**: Activity Backend must be running on port 5000

## Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Project Structure

```
src/
├── api/              # HTTP clients (Activity, Analytics)
├── components/       # Reusable React components
├── domain/
│   ├── models/      # TypeScript interfaces
│   └── services/    # Business logic (evaluation, timer)
├── pages/           # Route pages (Home, Quiz, Analytics)
└── store/           # Zustand state management
```

## Environment Variables

Create a `.env` file:

```env
VITE_ACTIVITY_BACKEND_URL=http://localhost:5000
VITE_ANALYTICS_BACKEND_URL=http://localhost:8000
```

## Development

Vite dev server runs on port 3000 with hot module replacement. All `/api` requests are proxied to the Activity backend at port 5000.

## Building for Production

```bash
npm run build
```

Output goes to `dist/` directory.
