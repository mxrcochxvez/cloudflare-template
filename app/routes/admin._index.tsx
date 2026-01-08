import type { MetaFunction } from "@remix-run/cloudflare";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Grid } from "~/components/ui/grid";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Dashboard | Cloudflare Template" },
  ];
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your application.
        </p>
      </div>

      {/* Stats Grid */}
      <Grid cols={4} gap="lg">
        <StatCard
          title="Total Users"
          value="2,847"
          change="+12.5%"
          trend="up"
          icon={Users}
        />
        <StatCard
          title="Page Views"
          value="45,231"
          change="+23.1%"
          trend="up"
          icon={Eye}
        />
        <StatCard
          title="Content Items"
          value="126"
          change="+5.4%"
          trend="up"
          icon={FileText}
        />
        <StatCard
          title="Conversion Rate"
          value="3.2%"
          change="-0.8%"
          trend="down"
          icon={TrendingUp}
        />
      </Grid>

      {/* Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                avatar="JD"
                title="New user registered"
                description="john.doe@example.com"
                time="2 minutes ago"
              />
              <ActivityItem
                avatar="SC"
                title="Content updated"
                description="Homepage hero section modified"
                time="15 minutes ago"
              />
              <ActivityItem
                avatar="MJ"
                title="New comment received"
                description="Great work on the new design!"
                time="1 hour ago"
              />
              <ActivityItem
                avatar="ER"
                title="Settings changed"
                description="Email notifications enabled"
                time="3 hours ago"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button variant="outline" className="h-auto py-4 flex-col items-start">
                <FileText className="h-5 w-5 mb-2 text-primary" />
                <span className="font-medium">Create Content</span>
                <span className="text-xs text-muted-foreground">Add new pages or posts</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col items-start">
                <Users className="h-5 w-5 mb-2 text-primary" />
                <span className="font-medium">Manage Users</span>
                <span className="text-xs text-muted-foreground">View and edit users</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col items-start">
                <Eye className="h-5 w-5 mb-2 text-primary" />
                <span className="font-medium">View Analytics</span>
                <span className="text-xs text-muted-foreground">Check performance</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col items-start">
                <TrendingUp className="h-5 w-5 mb-2 text-primary" />
                <span className="font-medium">Export Data</span>
                <span className="text-xs text-muted-foreground">Download reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Customize this dashboard</h3>
              <p className="text-muted-foreground">
                This is a template admin dashboard. Replace these placeholder components with your actual data.
              </p>
            </div>
            <Button>
              View Docs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <Badge variant={trend === "up" ? "success" : "destructive"} className="gap-1">
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change}
          </Badge>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Activity Item Component
function ActivityItem({
  avatar,
  title,
  description,
  time,
}: {
  avatar: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {avatar}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
    </div>
  );
}
