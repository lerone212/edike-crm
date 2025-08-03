import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Search, Filter, TrendingUp, Clock, User, MapPin } from 'lucide-react';
import { FUNNEL_STAGES, FunnelStage } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface SchoolFunnelData {
  id: string;
  schoolName: string;
  assignedEmployee: string;
  assignmentDate: string;
  currentStage: FunnelStage;
  lastActivity: string;
  totalVisits: number;
  daysInStage: number;
  location: string;
  nextStepAction?: string;
  nextStepDate?: string;
}

// Mock data for demonstration
const mockFunnelData: SchoolFunnelData[] = [
  {
    id: '1',
    schoolName: 'Lagos International School',
    assignedEmployee: 'John Doe',
    assignmentDate: '2024-01-15',
    currentStage: 'consideration',
    lastActivity: '2024-01-20T10:30:00Z',
    totalVisits: 4,
    daysInStage: 5,
    location: 'Lagos',
    nextStepAction: 'Follow up on proposal',
    nextStepDate: '2024-01-25'
  },
  {
    id: '2',
    schoolName: 'Abuja Technical College',
    assignedEmployee: 'Jane Smith',
    assignmentDate: '2024-01-10',
    currentStage: 'intent',
    lastActivity: '2024-01-18T14:15:00Z',
    totalVisits: 2,
    daysInStage: 8,
    location: 'Abuja',
    nextStepAction: 'Schedule demo session',
    nextStepDate: '2024-01-26'
  },
  {
    id: '3',
    schoolName: 'Port Harcourt Academy',
    assignedEmployee: 'Mike Johnson',
    assignmentDate: '2024-01-08',
    currentStage: 'decision_yes',
    lastActivity: '2024-01-22T09:00:00Z',
    totalVisits: 6,
    daysInStage: 2,
    location: 'Port Harcourt'
  },
  {
    id: '4',
    schoolName: 'Kano State University',
    assignedEmployee: 'Sarah Wilson',
    assignmentDate: '2024-01-12',
    currentStage: 'interest',
    lastActivity: '2024-01-19T16:45:00Z',
    totalVisits: 1,
    daysInStage: 6,
    location: 'Kano',
    nextStepAction: 'Initial discovery call',
    nextStepDate: '2024-01-24'
  },
  {
    id: '5',
    schoolName: 'Ibadan Grammar School',
    assignedEmployee: 'John Doe',
    assignmentDate: '2024-01-05',
    currentStage: 'awareness',
    lastActivity: '2024-01-21T11:20:00Z',
    totalVisits: 1,
    daysInStage: 12,
    location: 'Ibadan',
    nextStepAction: 'Send follow-up email',
    nextStepDate: '2024-01-23'
  }
];

const SalesFunnelPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');

  // Filter data based on user role and filters
  const filteredData = mockFunnelData.filter(school => {
    // If not super_admin, only show schools assigned to current user
    if (user?.role !== 'super_admin' && school.assignedEmployee !== user?.name) {
      return false;
    }

    // Apply search filter
    if (searchTerm && !school.schoolName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Apply stage filter
    if (stageFilter !== 'all' && school.currentStage !== stageFilter) {
      return false;
    }

    // Apply employee filter (only for super_admin)
    if (user?.role === 'super_admin' && employeeFilter !== 'all' && school.assignedEmployee !== employeeFilter) {
      return false;
    }

    return true;
  });

  // Calculate statistics
  const stats = {
    totalSchools: filteredData.length,
    inProgress: filteredData.filter(s => !['decision_yes', 'decision_no'].includes(s.currentStage)).length,
    closedWon: filteredData.filter(s => s.currentStage === 'decision_yes').length,
    conversionRate: filteredData.length > 0 ? (filteredData.filter(s => s.currentStage === 'decision_yes').length / filteredData.length * 100) : 0
  };

  // Group by stage for overview
  const stageBreakdown = FUNNEL_STAGES.reduce((acc, stage) => {
    const count = filteredData.filter(s => s.currentStage === stage.value).length;
    acc[stage.value] = { ...stage, count, percentage: filteredData.length > 0 ? (count / filteredData.length * 100) : 0 };
    return acc;
  }, {} as Record<string, any>);

  const getStageInfo = (stage: FunnelStage) => {
    return FUNNEL_STAGES.find(s => s.value === stage) || FUNNEL_STAGES[0];
  };

  const getProgressPercentage = (stage: FunnelStage) => {
    const stageIndex = FUNNEL_STAGES.findIndex(s => s.value === stage);
    return ((stageIndex + 1) / FUNNEL_STAGES.length) * 100;
  };

  const getDaysColor = (days: number) => {
    if (days <= 7) return 'text-success';
    if (days <= 14) return 'text-warning';
    return 'text-destructive';
  };

  const uniqueEmployees = [...new Set(mockFunnelData.map(s => s.assignedEmployee))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Funnel</h1>
          <p className="text-muted-foreground">
            Track the progress of schools through your sales pipeline
          </p>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchools}</div>
            <p className="text-xs text-muted-foreground">In pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active opportunities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closedWon}</div>
            <p className="text-xs text-muted-foreground">Successful deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Stage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Funnel Stage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FUNNEL_STAGES.map((stage) => {
              const stageData = stageBreakdown[stage.value];
              return (
                <div key={stage.value} className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full ${stage.color} flex items-center justify-center mb-2`}>
                    <span className="text-white font-bold text-sm">{stageData.count}</span>
                  </div>
                  <p className="text-sm font-medium">{stage.label}</p>
                  <p className="text-xs text-muted-foreground">{stageData.percentage.toFixed(1)}%</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>School Pipeline</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-[250px]"
                />
              </div>
              
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {FUNNEL_STAGES.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {user?.role === 'super_admin' && (
                <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {uniqueEmployees.map((employee) => (
                      <SelectItem key={employee} value={employee}>
                        {employee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No schools found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((school) => {
                const stageInfo = getStageInfo(school.currentStage);
                const progress = getProgressPercentage(school.currentStage);
                
                return (
                  <Card key={school.id} className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{school.schoolName}</h3>
                          <Badge 
                            variant="outline" 
                            className={`${stageInfo.color.replace('bg-', 'border-')} ${stageInfo.color.replace('bg-', 'text-')}`}
                          >
                            {stageInfo.label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{school.assignedEmployee}</span>
                            <span className="text-muted-foreground text-xs">
                              (since {new Date(school.assignmentDate).toLocaleDateString()})
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{school.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Last activity: {formatDistanceToNow(new Date(school.lastActivity), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Visits:</span>
                            <span className="font-medium">{school.totalVisits}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className={`font-medium ${getDaysColor(school.daysInStage)}`}>
                              {school.daysInStage} days in stage
                            </span>
                          </div>
                        </div>

                        {school.nextStepAction && (
                          <div className="mt-3 p-2 bg-accent/30 rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium">Next Step:</span> {school.nextStepAction}
                              {school.nextStepDate && (
                                <span className="text-muted-foreground ml-2">
                                  (Due: {new Date(school.nextStepDate).toLocaleDateString()})
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="lg:w-48">
                        <div className="text-xs text-muted-foreground mb-1">
                          Progress: {progress.toFixed(0)}%
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesFunnelPage;