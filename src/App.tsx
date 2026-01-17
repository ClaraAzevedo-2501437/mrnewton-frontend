import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TakeQuizPage } from './pages/TakeQuizPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { QuizInstancesPage } from './pages/QuizInstancesPage';
import { ConfigParamsPage } from './pages/ConfigParamsPage';
import { CreateQuizPage } from './pages/CreateQuizPage';
import { DeployQuizPage } from './pages/DeployQuizPage';
import { InstancesPage } from './pages/InstancesPage';
import { InstanceDetailsPage } from './pages/InstanceDetailsPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { ContractPage } from './pages/ContractPage';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz-instances" element={<QuizInstancesPage />} />
        <Route path="/quiz/:activityId" element={<TakeQuizPage />} />
        <Route path="/instances/:instanceId" element={<TakeQuizPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/config" element={<ConfigParamsPage />} />
        <Route path="/create-quiz" element={<CreateQuizPage />} />
        <Route path="/deploy-quiz" element={<DeployQuizPage />} />
        <Route path="/view-instances" element={<InstancesPage />} />
        <Route path="/instance-details" element={<InstanceDetailsPage />} />
        <Route path="/submissions" element={<SubmissionsPage />} />
        <Route path="/contract" element={<ContractPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
