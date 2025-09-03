import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "lead_created",
    title: "New lead from door knock",
    description: "1234 Oak Street, Fort Worth",
    user: { name: "Jake Rodriguez", initials: "JR" },
    timestamp: "2 minutes ago",
    status: "new"
  },
  {
    id: 2,
    type: "opportunity_moved",
    title: "Opportunity moved to Proposal Sent",
    description: "5678 Maple Avenue - Roofing project",
    user: { name: "Sarah Chen", initials: "SC" },
    timestamp: "15 minutes ago", 
    status: "active"
  },
  {
    id: 3,
    type: "deal_won",
    title: "Deal closed - $45,000",
    description: "9012 Pine Road - Garage door replacement",
    user: { name: "Mike Torres", initials: "MT" },
    timestamp: "1 hour ago",
    status: "won"
  },
  {
    id: 4,
    type: "service_created",
    title: "Service ticket created",
    description: "Warranty inspection at 3456 Elm Street",
    user: { name: "Lisa Park", initials: "LP" },
    timestamp: "3 hours ago",
    status: "active"
  }
];

export const RecentActivity = () => {
  return (
    <Card className="board-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Latest updates from your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={activity.user.name} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">
                    {activity.title}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`status-chip ${
                      activity.status === 'new' ? 'status-new' :
                      activity.status === 'active' ? 'status-active' :
                      activity.status === 'won' ? 'status-won' :
                      'status-new'
                    }`}
                  >
                    {activity.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {activity.description}
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.timestamp} • {activity.user.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};