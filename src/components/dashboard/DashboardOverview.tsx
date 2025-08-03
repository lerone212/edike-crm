import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import { 
  School, 
  Users, 
  TrendingUp, 
  Calendar,
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  BarChart3,
  Filter,
  Download,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const DashboardOverview = () => {
  const { user } = useAuth();

  // Mock data - will be replaced with Django API calls
  const stats = {
    totalSchools: 45,
    activeEmployees: 12,
    thisMonthVisits: 28,
    closedDeals: 8,
    assignedSchools: user?.assignedSchools?.length || 0,
    myVisitsThisMonth: 6,
    pendingFollowUps: 8,
    overdueTasks: 3,
    conversionRate: 18.5,
    avgResponseTime: 2.3
  };

  const funnelData = [
    { stage: 'New Leads', count: 15, percentage: 100 },
    { stage: 'Contacted', count: 12, percentage: 80 },
    { stage: 'Meeting Set', count: 8, percentage: 53 },
    { stage: 'Proposal Sent', count: 5, percentage: 33 },
    { stage: 'Closed Won', count: 3, percentage: 20 }
  ];

  const upcomingTasks = [
    { id: 1, school: 'Lagos High School', task: 'Principal Meeting', time: '2:00 PM Today', priority: 'high' },
    { id: 2, school: 'Abuja Technical', task: 'Follow-up Call', time: 'Tomorrow 10:00 AM', priority: 'medium' },
    { id: 3, school: 'Port Harcourt Academy', task: 'Proposal Review', time: 'Friday 3:00 PM', priority: 'low' }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Visit logged',
      school: 'Greenfield High School',
      employee: 'Mike Employee',
      time: '2 hours ago',
      stage: 'meeting_set'
    },
    {
      id: 2,
      action: 'School assigned',
      school: 'Riverside Academy',
      employee: 'Sarah Johnson',
      time: '4 hours ago',
      stage: 'new_lead'
    },
    {
      id: 3,
      action: 'Deal closed',
      school: 'Sunset Elementary',
      employee: 'Mike Employee',
      time: '1 day ago',
      stage: 'closed_won'
    }
  ];

  const getStageColor = (stage: string) => {
    const colors = {
      new_lead: 'bg-muted text-muted-foreground',
      contacted: 'bg-info/20 text-info',
      meeting_set: 'bg-warning/20 text-warning',
      proposal_sent: 'bg-secondary/20 text-secondary',
      closed_won: 'bg-success/20 text-success',
      closed_lost: 'bg-destructive/20 text-destructive'
    };
    return colors[stage as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-destructive',
      medium: 'text-warning',
      low: 'text-muted-foreground'
    };
    return colors[priority as keyof typeof colors] || 'text-muted-foreground';
  };

  return (
    <div className="space-y-4 -mt-2">
      {/* Good Morning Section - Simplified and Top Aligned */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white shadow-elegant">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Good morning, {user?.name}!</h1>
          <p className="text-white/90 text-base">Ready to make an impact today?</p>
        </div>
      </div>

      {/* Stats Grid - Role-based */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.role === 'super_admin' && (
          <>
            <Card className="relative overflow-hidden card-interactive shadow-soft border-0 professional-gradient">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Total Schools</CardTitle>
                <div className="bg-primary/10 p-2 rounded-lg">
                  <School className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-foreground mb-1">{stats.totalSchools}</div>
                <p className="text-sm text-muted-foreground">+3 from last month</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-primary"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                <Users className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeEmployees}</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary opacity-60"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-success opacity-60"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgResponseTime}h</div>
                <p className="text-xs text-muted-foreground">Industry leading</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-warning opacity-60"></div>
              </CardContent>
            </Card>
          </>
        )}

        {user?.role === 'employee' && (
          <>
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Schools</CardTitle>
                <School className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.assignedSchools}</div>
                <p className="text-xs text-muted-foreground">Active assignments</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-primary opacity-60"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visits This Month</CardTitle>
                <Calendar className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.myVisitsThisMonth}</div>
                <p className="text-xs text-muted-foreground">Great progress!</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-success opacity-60"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingFollowUps}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-warning opacity-60"></div>
              </CardContent>
            </Card>

          </>
        )}

        {user?.role === 'it_support' && (
          <>
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeEmployees}</div>
                <p className="text-xs text-muted-foreground">System health: Good</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-primary opacity-60"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Activity className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">Excellent performance</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-success opacity-60"></div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Funnel for Super Admin */}
          {user?.role === 'super_admin' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Sales Funnel Analytics
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <CardDescription>Track conversion through each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((stage, index) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{stage.stage}</span>
                        <span className="text-muted-foreground">{stage.count} schools</span>
                      </div>
                      <Progress value={stage.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">
                        {stage.percentage}% conversion
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Tasks for Employee */}
          {user?.role === 'employee' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>Your scheduled activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-4 p-4 bg-accent/30 rounded-lg">
                      <div className={`h-3 w-3 rounded-full ${getPriorityColor(task.priority)} bg-current`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{task.task}</p>
                        <p className="text-sm text-muted-foreground">{task.school}</p>
                        <p className="text-xs text-muted-foreground">{task.time}</p>
                      </div>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest updates from across your CRM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.school} • {activity.employee}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                    <Badge className={getStageColor(activity.stage)}>
                      {activity.stage.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Notifications & Quick Info */}
        <div className="space-y-6">
          <NotificationsPanel />
          
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-bold text-primary">{stats.thisMonthVisits} visits</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Closed Deals</span>
                <span className="font-bold text-success">{stats.closedDeals} schools</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Response Rate</span>
                <span className="font-bold text-warning">{stats.conversionRate}%</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;