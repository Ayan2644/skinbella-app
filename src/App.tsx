import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Quiz from "./pages/Quiz";
import Login from "./pages/Login";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Today />} />
            <Route path="relatorio" element={<Report />} />
            <Route path="nutrientes" element={<Nutrients />} />
            <Route path="rotina" element={<Routine />} />
            <Route path="checklist" element={<Checklist />} />
            <Route path="dieta" element={<Diet />} />
            <Route path="biblioteca" element={<Library />} />
            <Route path="produtos" element={<Products />} />
            <Route path="faq" element={<Faq />} />
            <Route path="admin" element={<Dashboard />} />
            <Route path="admin/usuarios" element={<AdminUsers />} />
            <Route path="admin/assinaturas" element={<Subscriptions />} />
            <Route path="admin/funil" element={<Funnel />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
