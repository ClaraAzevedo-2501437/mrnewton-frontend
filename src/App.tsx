import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TakeQuizPage } from './pages/TakeQuizPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz/:activityId" element={<TakeQuizPage />} />
        <Route path="/instances/:instanceId" element={<TakeQuizPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
