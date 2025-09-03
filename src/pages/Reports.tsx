import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download } from "lucide-react";

const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Analyze your business performance and metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="btn-copper gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="board-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="board-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+180.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="board-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+19%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="board-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+201</span> since last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Sources */}
        <Card className="board-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Lead Sources
            </CardTitle>
            <CardDescription>
              Where your leads are coming from
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Door Knocking</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-16"></div>
                </div>
                <span className="text-sm font-medium">67%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Referrals</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full w-8"></div>
                </div>
                <span className="text-sm font-medium">21%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Online</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full w-3"></div>
                </div>
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Pipeline */}
        <Card className="board-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Sales Pipeline
            </CardTitle>
            <CardDescription>
              Current opportunities by stage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Discovery</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">$125,400</span>
                <span className="text-xs text-muted-foreground">(34 deals)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Proposal</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">$89,200</span>
                <span className="text-xs text-muted-foreground">(18 deals)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Negotiation</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">$67,800</span>
                <span className="text-xs text-muted-foreground">(12 deals)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Closing</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">$45,600</span>
                <span className="text-xs text-muted-foreground">(7 deals)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="board-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Team Performance
            </CardTitle>
            <CardDescription>
              Top performers this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">JR</span>
                </div>
                <span className="text-sm">Jake Rodriguez</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">$23,400</div>
                <div className="text-xs text-muted-foreground">8 deals</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-success">SC</span>
                </div>
                <span className="text-sm">Sarah Chen</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">$19,800</div>
                <div className="text-xs text-muted-foreground">6 deals</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-accent">MT</span>
                </div>
                <span className="text-sm">Mike Torres</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">$17,200</div>
                <div className="text-xs text-muted-foreground">5 deals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="board-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Activity Summary
            </CardTitle>
            <CardDescription>
              Key metrics from the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Door knocks logged</span>
              <span className="text-sm font-medium">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Estimates created</span>
              <span className="text-sm font-medium">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Follow-ups completed</span>
              <span className="text-sm font-medium">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Service tickets closed</span>
              <span className="text-sm font-medium">42</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;