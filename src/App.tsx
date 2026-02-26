import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { BrandProvider } from "@/context/BrandContext";
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";

const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Brands = lazy(() => import("@/pages/Brands"));
const BrandDetail = lazy(() => import("@/pages/BrandDetail"));
const StageOverview = lazy(() => import("@/pages/StageOverview"));
const Analytics = lazy(() => import("@/pages/Analytics"));

const queryClient = new QueryClient();

const Loader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <BrandProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Suspense fallback={<Loader />}><Login /></Suspense>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/brands" element={<ProtectedRoute><Brands /></ProtectedRoute>} />
                <Route path="/brands/:brandId" element={<ProtectedRoute><BrandDetail /></ProtectedRoute>} />
                <Route path="/stages/:stageName" element={<ProtectedRoute><StageOverview /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </BrandProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
