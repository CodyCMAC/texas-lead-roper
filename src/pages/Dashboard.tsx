import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { DoorKnockDialog } from "@/components/DoorKnockDialog";
import { EstimateDialog } from "@/components/EstimateDialog";
import { Plus, FileText, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your Lead Wrangler command center
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => navigate('/properties')}>
            <Map className="h-4 w-4" />
            Field Map
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </Button>
          <Button className="btn-copper gap-2" onClick={() => navigate('/leads')}>
            <Plus className="h-4 w-4" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="board-card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <DoorKnockDialog>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Log Door Knock
              </Button>
            </DoorKnockDialog>
            <EstimateDialog>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Create Estimate
              </Button>
            </EstimateDialog>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate('/properties')}>
              <Map className="h-4 w-4" />
              Plan Route
            </Button>
          </div>
          </div>

          {/* Hot Leads */}
          <div className="board-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">🔥 Hot Leads</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="font-medium">1234 Oak Street</p>
                <p className="text-muted-foreground">AI Score: 95 • Follow-up due</p>
              </div>
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="font-medium">5678 Elm Avenue</p>
                <p className="text-muted-foreground">AI Score: 88 • High interest</p>
              </div>
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="font-medium">9012 Pine Street</p>
                <p className="text-muted-foreground">AI Score: 82 • Recent damage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;