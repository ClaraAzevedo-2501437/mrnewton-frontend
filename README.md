# MrNewton Frontend

Interactive frontend for the MrNewton Activity Provider - handles quiz execution and analytics visualization for physics education.

## Architecture

The frontend follows a clean architecture pattern:

```
src/
├── api/              # Backend API clients
├── domain/           # Business logic and models
│   ├── models/       # Type definitions
│   └── evaluators/   # Quiz evaluation logic
├── state/            # State management (Zustand)
├── components/       # React components
│   ├── quiz/         # Quiz-related components
│   └── analytics/    # Analytics dashboard
├── pages/            # Main application pages
└── styles/           # Global styles
```

## Core Responsibilities

### Student Flow (Quiz Execution)
- Fetch quiz configuration from Activity backend
- Render quiz UI with all exercises
- **Execute quiz logic entirely on frontend**:
  - Answer validation
  - Score calculation
  - Retry management
  - Approval logic
- Send **final results only** to backend

### Teacher Flow (Analytics)
- Fetch analytics contract from Analytics backend
- Allow metric selection
- Request calculated metrics
- Display analytics dashboards

## Key Features

- **Local Quiz Evaluation**: All scoring and validation happens in the browser
- **Retry Management**: Supports configurable retry attempts
- **Tolerance Checking**: Numeric and formula validation with tolerances
- **Approval Logic**: Dynamic threshold-based approval
- **Analytics Dashboard**: On-demand metrics from backend
- **Type-Safe**: Full TypeScript implementation

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **React Router** - Navigation
- **Axios** - API communication
- **Math.js** - Mathematical expression evaluation
- **Vite** - Build tool and dev server

## Setup

### 1. Install Dependencies

```bash
cd mrnewton-frontend
npm install
```

### 2. Configure Backend URLs

Backend endpoints are configured in `vite.config.ts`:
- Activity API: `http://localhost:5000`
- Analytics API: `http://localhost:8000`

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Project Structure

### Domain Models

**Quiz Models** (`src/domain/models/Quiz.ts`):
- `QuizConfig` - Quiz definition from backend
- `Exercise` - Individual question
- `StudentAnswer` - Answer with rationale
- `AttemptResult` - Result of one attempt
- `QuizSession` - Complete quiz state
- `FinalQuizResult` - Data sent to backend

**Analytics Models** (`src/domain/models/Analytics.ts`):
- `MetricDefinition` - Available metric types
- `AnalyticsContract` - Contract from backend
- `MetricRequest` - Request parameters
- `MetricResult` - Calculated metric data

### Quiz Evaluator

The `QuizEvaluator` (`src/domain/evaluators/quizEvaluator.ts`) implements:

- **Answer Evaluation**: Checks correctness with tolerance
- **Numeric Tolerance**: Relative and absolute tolerance checking
- **Expression Evaluation**: Math formula parsing and validation
- **Scoring**: Linear and non-linear scoring policies
- **Approval Logic**: Threshold-based approval
- **Retry Management**: Validates retry eligibility

### API Clients

**Activity API** (`src/api/activityApi.ts`):
- `getQuiz(activityId)` - Fetch quiz definition
- `createInstance(activityId)` - Create deployment instance
- `saveQuizResults(result)` - Save final results
- `getAvailableActivities()` - List all quizzes

**Analytics API** (`src/api/analyticsApi.ts`):
- `getAnalyticsContract()` - Fetch available metrics
- `getMetrics(requests)` - Request calculated metrics
- `getActivityMetrics(activityId, metricIds)` - Activity-specific metrics
- `getStudentMetrics(studentId, metricIds)` - Student-specific metrics

### State Management

**Quiz Store** (`src/state/quizSession.ts`):
- Manages quiz session state
- Handles answer submission
- Manages retry flow
- Sends final results to backend

**Analytics Store** (`src/state/analyticsState.ts`):
- Manages analytics dashboard state
- Handles metric selection
- Fetches metrics from backend

### Components

**Quiz Components**:
- `ExerciseView` - Single question with options and rationale
- `ResultsView` - Displays attempt results and retry options
- `QuizView` - Main quiz container

**Analytics Components**:
- `Dashboard` - Analytics dashboard with metric selection and results

### Pages

- `HomePage` - Quiz selection and navigation
- `TakeQuizPage` - Quiz execution flow
- `AnalyticsPage` - Teacher analytics dashboard

## Quiz Flow

1. **Initialize**: Student enters ID, fetches quiz configuration
2. **Answer**: Student answers all questions with rationales
3. **Submit**: Frontend evaluates all answers locally
4. **Results**: Display score and approval status
5. **Retry**: If not approved and retries available, start new attempt
6. **Complete**: Send final results to backend (once, at the end)

## Analytics Flow

1. **Load Contract**: Fetch available metrics from backend
2. **Select Metrics**: Teacher selects which metrics to view
3. **Fetch Metrics**: Request calculation from backend
4. **Display**: Show results in dashboard

## Data Flow

### Quiz Execution
```
Backend → Quiz Config → Frontend
Frontend → Answer → Local Evaluation
Frontend → Result → Display
Frontend → Final Results → Backend (once)
```

### Analytics
```
Backend → Analytics Contract → Frontend
Frontend → Metric Selection → Backend Request
Backend → Calculated Metrics → Frontend Display
```

## Configuration

### Backend Integration

The frontend expects the following API endpoints:

**Activity Backend** (`/api/activity`):
- `GET /config/:activityId` - Get quiz definition
- `POST /deploy` - Create instance
- `POST /submissions` - Save results
- `GET /config` - List all activities

**Analytics Backend** (`/api/analytics`):
- `GET /get-analytics-contract` - Get available metrics
- `POST /get-metrics` - Request calculated metrics

### Environment Variables

Create `.env` file (optional):
```
VITE_ACTIVITY_API_URL=http://localhost:5000
VITE_ANALYTICS_API_URL=http://localhost:8000
```

## Design Decisions

1. **Frontend-Only Quiz Logic**: All quiz execution logic runs in the browser for immediate feedback and reduced backend load

2. **Single Result Submission**: Only final results sent to backend to minimize network requests

3. **State Management**: Zustand chosen for simplicity and TypeScript support

4. **Inline Styles**: Used for component isolation and easier maintenance in this project size

5. **Math.js**: Chosen for robust mathematical expression evaluation with tolerance checking

## Constraints Respected

✅ Frontend handles all quiz execution logic
✅ Backend only provides configuration and stores results  
✅ Analytics calculated on backend, only displayed on frontend
✅ No quiz logic implemented in backend
✅ Modular, typed, and testable code
✅ Clean separation between quiz and analytics flows

## Future Enhancements

- Add unit tests for Quiz Evaluator
- Implement timer functionality
- Add progress saving
- Support for image-based questions
- Enhanced analytics visualizations
- Accessibility improvements (ARIA labels, keyboard navigation)
- Offline support with service workers

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Part of the MrNewton educational platform.