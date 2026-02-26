import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <div className="flex items-center h-10 px-4 border-b border-border bg-card">
            <SidebarTrigger />
          </div>
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
