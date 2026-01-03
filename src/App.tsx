// Main App Component with Routing

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Styles
import './styles/index.css';
import './styles/components.css';
import './App.css';

// Layout Components
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { ChatWidget } from './components/ChatWidget/ChatWidget';

// Pages
import { SupervisorDashboard } from './pages/Dashboard/SupervisorDashboard';
import { AgentWorkspace } from './pages/AgentPanel/AgentWorkspace';
import { TicketList } from './pages/Tickets/TicketList';
import { DecisionEngine } from './pages/DecisionEngine/DecisionEngine';
import { ConversationsPage } from './pages/Conversations/ConversationsPage';
import { CasesPage } from './pages/Cases/CasesPage';
import { AIInsightsPage } from './pages/AIInsights/AIInsightsPage';
import { AgentRoutingPage } from './pages/AgentRouting/AgentRoutingPage';
import { SecurityPage } from './pages/Security/SecurityPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { LoginPage } from './pages/Auth/LoginPage';

// Layout Wrapper
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      <Header title={title} />
      <main className="page-content">
        {children}
      </main>
    </div>
    <ChatWidget />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout title="Dashboard">
              <SupervisorDashboard />
            </Layout>
          }
        />
        <Route
          path="/agent-panel"
          element={
            <Layout title="Agent Panel">
              <AgentWorkspace />
            </Layout>
          }
        />
        <Route
          path="/conversations"
          element={
            <Layout title="Conversations">
              <ConversationsPage />
            </Layout>
          }
        />
        <Route
          path="/cases"
          element={
            <Layout title="Cases">
              <CasesPage />
            </Layout>
          }
        />
        <Route
          path="/tickets"
          element={
            <Layout title="Tickets">
              <TicketList />
            </Layout>
          }
        />
        <Route
          path="/ai-insights"
          element={
            <Layout title="AI Insights">
              <AIInsightsPage />
            </Layout>
          }
        />
        <Route
          path="/decision-engine"
          element={
            <Layout title="Decision Engine">
              <DecisionEngine />
            </Layout>
          }
        />
        <Route
          path="/agents"
          element={
            <Layout title="Agent Routing">
              <AgentRoutingPage />
            </Layout>
          }
        />
        <Route
          path="/security"
          element={
            <Layout title="Security">
              <SecurityPage />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout title="Settings">
              <SettingsPage />
            </Layout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
