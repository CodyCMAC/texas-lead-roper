import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { BannerNotificationSystem } from "@/components/BannerNotification";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <AppSidebar user={user} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
      
      {/* Banner Notifications */}
      <BannerNotificationSystem />
    </div>
  );
};