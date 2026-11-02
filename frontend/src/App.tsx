import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MockProvider } from '@/mock/MockContext';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { OverviewPage } from '@/pages/OverviewPage';
import { WorkflowsPage } from '@/pages/WorkflowsPage';
import { WorkflowCreatePage } from '@/pages/WorkflowCreatePage';
import { WorkflowDetailPage } from '@/pages/WorkflowDetailPage';
import { ExecutionsPage } from '@/pages/ExecutionsPage';
import { ExecutionDetailPage } from '@/pages/ExecutionDetailPage';
import { AgentsPage } from '@/pages/AgentsPage';
import { IntegrationsPage } from '@/pages/IntegrationsPage';
import { ApprovalsPage } from '@/pages/ApprovalsPage';
import { SettingsPage } from '@/pages/SettingsPage';

export function App() {
  return (
    <MockProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Authentication */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Application Workspace */}
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            
            {/* Workflows */}
            <Route path="workflows" element={<WorkflowsPage />} />
            <Route path="workflows/new" element={<WorkflowCreatePage />} />
            <Route path="workflows/:id" element={<WorkflowDetailPage />} />

            {/* Executions */}
            <Route path="executions" element={<ExecutionsPage />} />
            <Route path="executions/:id" element={<ExecutionDetailPage />} />

            {/* Management & System */}
            <Route path="agents" element={<AgentsPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MockProvider>
  );
}

export default App;
