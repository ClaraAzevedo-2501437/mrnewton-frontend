# Quick Start Guide

## Prerequisites

- Node.js v18+ installed
- Activity backend running on `http://localhost:5000`
- Analytics backend running on `http://localhost:8000`

## Installation

```bash
cd mrnewton-frontend
npm install
```

## Running Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
npm run preview  # Preview production build
```

## Project Overview

### Student Flow
1. Navigate to home page
2. Select a quiz
3. Enter student ID
4. Answer all questions with rationales
5. Submit answers (evaluated locally)
6. View results and retry if needed
7. Complete quiz (results sent to backend)

### Teacher Flow
1. Navigate to Analytics page
2. Select filter type (all/activity/student)
3. Choose metrics to display
4. Fetch metrics from backend
5. View dashboard

## Key Files

- `src/domain/evaluators/quizEvaluator.ts` - All quiz logic
- `src/state/quizSession.ts` - Quiz state management
- `src/api/activityApi.ts` - Activity backend client
- `src/api/analyticsApi.ts` - Analytics backend client

## Backend API Endpoints Required

### Activity Backend (port 5000)
- `GET /api/activity/config` - List all quizzes
- `GET /api/activity/config/:activityId` - Get quiz configuration
- `POST /api/activity/deploy` - Create deployment instance
- `POST /api/activity/submissions` - Save quiz results

### Analytics Backend (port 8000)
- `GET /api/analytics/get-analytics-contract` - Get metrics contract
- `POST /api/analytics/get-metrics` - Get calculated metrics

## Architecture Highlights

✅ **Quiz logic runs entirely in frontend** - QuizEvaluator handles all scoring, validation, and retry logic

✅ **Backend is configuration provider** - Only serves quiz definitions and stores final results

✅ **Analytics calculated in backend** - Frontend only displays metrics

✅ **Type-safe** - Full TypeScript implementation with strict types

✅ **State management** - Zustand for simple, efficient state management

✅ **Mathematical evaluation** - Math.js for formula parsing and tolerance checking

## Troubleshooting

### Backend Connection Issues
- Verify both backends are running
- Check proxy configuration in `vite.config.ts`
- Ensure CORS is enabled on backends

### TypeScript Errors
```bash
npx tsc --noEmit  # Check for type errors
```

### Build Issues
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Testing

Currently no automated tests. To test manually:
1. Start both backends
2. Start frontend dev server
3. Navigate through student and teacher flows
4. Verify all features work end-to-end

## Next Steps

- Add unit tests for QuizEvaluator
- Add integration tests
- Implement error boundaries
- Add loading states
- Improve accessibility
- Add animations and transitions
