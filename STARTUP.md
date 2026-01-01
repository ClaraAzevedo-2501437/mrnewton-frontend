# Starting the MrNewton Frontend Application

## Complete Startup Guide

### Prerequisites
1. Activity Backend running on port 5000
2. Node.js v18+ installed
3. All dependencies installed (`npm install`)

### Option 1: Run Everything Together (Recommended)

```bash
cd mrnewton-frontend
npm run start:all
```

This starts:
- **BFF Server** on `http://localhost:3001` (proxies to Activity backend)
- **Vite Dev Server** on `http://localhost:3000` (React UI)

### Option 2: Run Separately

**Terminal 1 - BFF Server:**
```bash
cd mrnewton-frontend
npm run server:dev
```

**Terminal 2 - Frontend UI:**
```bash
cd mrnewton-frontend
npm run dev
```

### Architecture Flow

```
┌─────────────────┐
│   React UI      │
│  localhost:3000 │
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│   BFF Server    │  ← YOU ARE HERE (Middleware Layer)
│  localhost:3001 │
└────────┬────────┘
         │ Proxied Requests
         ▼
┌─────────────────┐
│Activity Backend │
│  localhost:5000 │
└─────────────────┘
```

### What Changed

**Before:**
- Frontend called Activity backend directly via Vite proxy

**After:**
- Frontend calls local BFF server (port 3001)
- BFF server forwards all requests to Activity backend (port 5000)
- All activity-related requests now go through the frontend first

### Testing the Setup

1. **Check BFF is running:**
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok","service":"mrnewton-frontend-bff"}
```

2. **Test proxy to Activity backend:**
```bash
curl http://localhost:3001/api/activity/config
# Should return list of activities from backend
```

3. **Access the UI:**
Open browser to `http://localhost:3000`

### Troubleshooting

**BFF server won't start:**
- Check port 3001 is not in use
- Verify Activity backend is running on port 5000
- Check `.env` file exists with correct values

**Frontend can't connect to BFF:**
- Verify BFF is running (`npm run server:dev`)
- Check `src/api/activityApi.ts` uses `http://localhost:3001`
- Check browser console for CORS errors

**Activity backend connection fails:**
- Verify Activity backend is running: `curl http://localhost:5000/health`
- Check `.env` has correct `ACTIVITY_BACKEND_URL`
- Review BFF server console for proxy errors

### Development Workflow

1. Make changes to server code in `server/` directory
2. Nodemon automatically restarts the BFF server
3. Make changes to React code in `src/` directory  
4. Vite hot-reloads the UI automatically
5. Both watch for changes independently

### Production Build

```bash
# Build React app
npm run build

# Run BFF server in production
PORT=3001 node dist/server/index.js
```

### Environment Configuration

Edit `.env` file:
```env
PORT=3001
ACTIVITY_BACKEND_URL=http://localhost:5000
ANALYTICS_BACKEND_URL=http://localhost:8000
```
