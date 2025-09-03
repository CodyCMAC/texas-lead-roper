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
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AppSidebarProps {
  user: SupabaseUser | null;
}

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
  { name: "Properties", icon: Building2, href: "/properties" },
  { name: "Contacts", icon: Users, href: "/contacts" },
  { name: "Leads", icon: Target, href: "/leads" },
  { name: "Opportunities", icon: TrendingUp, href: "/opportunities" },
  { name: "Service", icon: Wrench, href: "/service" },
  { name: "Tasks", icon: CheckSquare, href: "/tasks" },
];

export const AppSidebar = ({ user }: AppSidebarProps) => {
  const [profile, setProfile] = useState<any>(null);

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
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Star className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-copper bg-clip-text text-transparent">
              Lead Wrangler
            </h1>
            <p className="text-xs text-muted-foreground">Fort Worth TX</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Button
                variant={item.active ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  item.active && "btn-copper shadow-soft"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar_url} alt={userDisplayName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userDisplayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex-1">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="flex-1"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};