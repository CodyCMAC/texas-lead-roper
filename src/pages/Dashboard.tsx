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
    <div className="relative space-y-8 overflow-hidden min-h-screen">
      {/* Creative Watermark Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main large watermark - top right */}
        <div 
          className="absolute -top-16 -right-16 w-[500px] h-[500px] opacity-[0.08] transform rotate-12 transition-all duration-1000"
          style={{
            backgroundImage: `url(/lovable-uploads/66dd8bbe-07df-4be7-ad54-ff0988f53fce.png)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'hue-rotate(15deg) saturate(0.7)'
          }}
        />
        {/* Secondary watermark - bottom left */}
        <div 
          className="absolute bottom-0 -left-16 w-80 h-80 opacity-[0.06] transform -rotate-6"
          style={{
            backgroundImage: `url(/lovable-uploads/66dd8bbe-07df-4be7-ad54-ff0988f53fce.png)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'hue-rotate(-10deg) saturate(0.5)'
          }}
        />
        {/* Center watermark - very subtle */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03]"
          style={{
            backgroundImage: `url(/lovable-uploads/66dd8bbe-07df-4be7-ad54-ff0988f53fce.png)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'blur(1px) saturate(0.3)'
          }}
        />
        {/* Subtle glow effect */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-radial from-primary/[0.02] via-primary/[0.01] to-transparent rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
      </div>
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
          <Button variant="outline" className="gap-2" onClick={() => navigate('/reports')}>
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