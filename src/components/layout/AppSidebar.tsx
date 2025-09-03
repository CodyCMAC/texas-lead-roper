import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Target, 
  TrendingUp, 
  Wrench, 
  CheckSquare, 
  Star,
  LogOut,
  User,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileDialog } from "@/components/ProfileDialog";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AppSidebarProps {
  user: SupabaseUser | null;
}

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Properties", icon: Building2, href: "/properties" },
  { name: "Contacts", icon: Users, href: "/contacts" },
  { name: "Leads", icon: Target, href: "/leads" },
  { name: "Opportunities", icon: TrendingUp, href: "/opportunities" },
  { name: "Service", icon: Wrench, href: "/service" },
  { name: "Tasks", icon: CheckSquare, href: "/tasks" },
  { name: "About Us", icon: Info, href: "/about-us" },
];

export const AppSidebar = ({ user }: AppSidebarProps) => {
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    setProfile(data);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("See you later, partner!");
    }
  };

  const userDisplayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const userInitials = userDisplayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-card to-background border-r border-border/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="p-6 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-copper rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <img 
              src="/lovable-uploads/c0b242e2-5443-4955-a498-c225fb78a2d9.png" 
              alt="Lead Wrangler" 
              className="h-20 w-20 relative shadow-copper hover:scale-105 transition-all duration-300"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <Star className="h-20 w-20 text-primary hidden relative" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-copper bg-clip-text text-transparent hover:bg-gradient-sunset transition-all duration-500">
              Lead Wrangler
            </h1>
            <p className="text-xs text-muted-foreground/80 tracking-wide">Fort Worth TX</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-success/80 font-medium">ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <div key={item.name} className="relative group">
              {isActive && (
                <div className="absolute inset-0 bg-gradient-copper rounded-lg blur opacity-20"></div>
              )}
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 relative transition-all duration-300 hover:shadow-soft",
                  isActive && "bg-gradient-copper text-white shadow-copper hover:shadow-copper/70",
                  !isActive && "hover:bg-accent/20 hover:text-accent-foreground hover:translate-x-1"
                )}
                onClick={() => navigate(item.href)}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive && "text-white drop-shadow-sm",
                  !isActive && "group-hover:scale-110"
                )} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Button>
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border/30 bg-gradient-to-r from-accent/5 to-primary/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-sage rounded-full blur opacity-30 animate-pulse"></div>
            <Avatar className="h-12 w-12 relative border-2 border-primary/20">
              <AvatarImage src={profile?.avatar_url} alt={userDisplayName} />
              <AvatarFallback className="bg-gradient-copper text-white font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              {userDisplayName}
            </p>
            <p className="text-xs text-muted-foreground/80 truncate">{user?.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs text-primary/80 font-medium">AUTHENTICATED</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <ProfileDialog>
            <Button variant="outline" size="sm" className="group hover:bg-accent/20 hover:border-accent transition-all duration-300">
              <User className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Profile</span>
            </Button>
          </ProfileDialog>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            className="group hover:bg-destructive/20 hover:border-destructive/40 hover:text-destructive transition-all duration-300"
          >
            <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Exit</span>
          </Button>
        </div>
        
        <div className="flex justify-center">
          <div className="p-1 rounded-lg bg-accent/10 border border-accent/20">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};