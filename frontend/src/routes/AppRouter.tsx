import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { RedirectPage } from "../pages/RedirectPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { TodayPage } from "../pages/TodayPage";
import { CalendarPage } from "../pages/CalendarPage";
import { LogPage } from "../pages/LogPage";
import { InsightsPage } from "../pages/InsightsPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../layout/AppLayout";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedirectPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/today" replace />} />
            <Route path="today" element={<TodayPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="log" element={<LogPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}