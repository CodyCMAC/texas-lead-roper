import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, DollarSign, Wrench } from "lucide-react";

const stats = [
  {
    title: "Active Leads",
    value: "124",
    description: "↗ 12% from last month",
    icon: Target,
    trend: "up"
  },
  {
    title: "Pipeline Value",
    value: "$2.4M",
    description: "↗ 8% from last month", 
    icon: TrendingUp,
    trend: "up"
  },
  {
    title: "Won This Month",
    value: "$485K",
    description: "↗ 15% from last month",
    icon: DollarSign,
    trend: "up"
  },
  {
    title: "Service Tickets",
    value: "23",
    description: "↘ 5% from last month",
    icon: Wrench,
    trend: "down"
  }
];

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="board-card hover:shadow-copper transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stat.value}
            </div>
            <p className={`text-xs ${
              stat.trend === 'up' ? 'text-success' : 'text-destructive'
            }`}>
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};