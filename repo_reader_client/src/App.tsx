import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/toast";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import AuthCallbackPage from "@/pages/auth-callback";
import DashboardPage from "@/pages/dashboard";
import OverviewPage from "@/pages/dashboard/overview";
import SettingsPage from "@/pages/dashboard/settings";
import ChatPage from "@/pages/chat/chat";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/overview" element={<OverviewPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/chat/:repoId" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
