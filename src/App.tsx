import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import Quiz from "./pages/Quiz";
import Login from "./pages/Login";
import DevLogin from "./pages/DevLogin";
import AppShell from "./pages/AppShell";
import NotFound from "./pages/NotFound";
import Today from "./pages/app/Today";
import Report from "./pages/app/Report";
import Nutrients from "./pages/app/Nutrients";
import Routine from "./pages/app/Routine";
import Checklist from "./pages/app/Checklist";
import Diet from "./pages/app/Diet";
import Library from "./pages/app/Library";
import Products from "./pages/app/Products";
import Faq from "./pages/app/Faq";
import Dashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import Subscriptions from "./pages/admin/Subscriptions";
import Funnel from "./pages/admin/Funnel";
import QuizEditor from "./pages/admin/QuizEditor";
import PageEditor from "./pages/admin/PageEditor";
import ResultPreview from "./pages/admin/ResultPreview";

const queryClient = new QueryClient();

const App = () => {
  // Prevent blank screen from unhandled auth refresh failures
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      if (event.reason?.message === "Failed to fetch") {
        event.preventDefault();
        console.warn("[App] Suppressed unhandled fetch rejection (likely stale auth token)");
      }
    };
    window.addEventListener("unhandledrejection", handler);
    return () => window.removeEventListener("unhandledrejection", handler);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dev-login" element={<DevLogin />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Today />} />
              <Route path="relatorio" element={<Report />} />
              <Route path="nutrientes" element={<Nutrients />} />
              <Route path="rotina" element={<Routine />} />
              <Route path="checklist" element={<Checklist />} />
              <Route path="dieta" element={<Diet />} />
              <Route path="biblioteca" element={<Library />} />
              <Route path="produtos" element={<Products />} />
              <Route path="faq" element={<Faq />} />
              <Route path="admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="admin/usuarios" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="admin/assinaturas" element={<AdminRoute><Subscriptions /></AdminRoute>} />
              <Route path="admin/funil" element={<AdminRoute><Funnel /></AdminRoute>} />
              <Route path="admin/quiz-editor" element={<AdminRoute><QuizEditor /></AdminRoute>} />
              <Route path="admin/page-editor" element={<AdminRoute><PageEditor /></AdminRoute>} />
              <Route path="admin/result-preview" element={<AdminRoute><ResultPreview /></AdminRoute>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
