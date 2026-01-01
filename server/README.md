# Frontend BFF Server

This Backend-for-Frontend (BFF) layer acts as an intermediary between the React frontend and the Activity backend.

## Architecture

```
React UI (port 3000) → BFF Server (port 3001) → Activity Backend (port 5000)
```

## Why BFF?

- **Single entry point**: All requests go through the frontend first
- **Request validation**: Can add authentication/authorization
- **Data transformation**: Can modify request/response formats
- **Error handling**: Centralized error handling
- **Monitoring**: Log all API calls in one place

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run server:dev
```

### Production Mode
```bash
npm run server
```

### Run Both Frontend and BFF
```bash
npm run start:all
```

## Available Endpoints

All endpoints proxy to `http://localhost:5000/api/activity`

### Configuration
- `GET /api/activity/config/params` - Get configuration parameters
- `PUT /api/activity/config/params` - Update configuration parameters
- `GET /api/activity/config/new` - **HTML Form** to create new activity
- `GET /api/activity/config/:activityId` - Get specific activity
- `GET /api/activity/config` - Get all activities

### Deployment
- `POST /api/activity/deploy` - Deploy activity instance
- `GET /api/activity/deploy/:instanceId` - Get instance
- `GET /api/activity/deploy/activity/:activityId` - Get instances by activity

### Submissions
- `POST /api/activity/submissions` - Record submission
- `GET /api/activity/submissions/instance/:instanceId` - Get instance submissions
- `GET /api/activity/submissions/instance/:instanceId/student/:studentId` - Get student submission

## Environment Variables

Create `.env` file:
```
PORT=3001
ACTIVITY_BACKEND_URL=http://localhost:5000
ANALYTICS_BACKEND_URL=http://localhost:8000
```

## Request Flow Example

1. **Frontend**: `axios.get('http://localhost:3001/api/activity/config')`
2. **BFF Server**: Receives request, logs it
3. **BFF Server**: Proxies to `http://localhost:5000/api/activity/config`
4. **Activity Backend**: Processes request, returns data
5. **BFF Server**: Returns response to frontend

## Adding New Endpoints

1. Add route in `server/routes/activityRoutes.ts`
2. Add controller function in `server/controllers/activityController.ts`
3. Use `proxyRequest` helper to forward to backend

## Logs

All requests are logged with timestamp and method:
```
[2026-01-01T19:00:00.000Z] GET /api/activity/config
Proxying GET http://localhost:5000/api/activity/config
```
