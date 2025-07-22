import { useState } from "react";
import { Header } from "@/components/navigation/header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { VeriScoreCard } from "@/components/dashboard/veri-score-card";
import { ProfileBuilder2 } from "@/components/profile/profile-builder-2";

export default function Profile() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 hero-gradient text-white">
      <Header
        onDashboardToggle={() => setIsDashboardOpen(!isDashboardOpen)}
        onMobileMenuToggle={() => setIsDashboardOpen(!isDashboardOpen)}
      />
      <DashboardSidebar
        isOpen={isDashboardOpen}
        isPinned={true}
        isCollapsed={isCollapsed}
        onClose={() => setIsDashboardOpen(false)}
        onPin={() => {}}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      <main className={`pt-20 transition-all duration-300 ${isDashboardOpen ? (isCollapsed ? 'lg:ml-20' : 'lg:ml-80') : ''}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <div className="text-sm text-gray-400">
              Create and manage your creator profile
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Builder 2.0 - Main Content */}
            <div className="lg:col-span-3">
              <ProfileBuilder2 />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <VeriScoreCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}