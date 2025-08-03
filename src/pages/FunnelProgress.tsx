import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, TrendingUp, Target, Award, Users } from 'lucide-react';
import { FUNNEL_STAGES, FunnelStage } from '@/types/auth';
import ExportButton from '@/components/export/ExportButton';

interface FunnelData {
  schoolId: string;
  schoolName: string;
  employeeName: string;
  currentStage: FunnelStage;
  lastActivity: string;
  totalVisits: number;
  daysInStage: number;
}

const FunnelProgress = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<FunnelStage | 'all'>('all');

  // Mock data - in real app, this would come from API
  const [funnelData] = useState<FunnelData[]>([
    {
      schoolId: 'school-1',
      schoolName: 'Greenfield High School',
      employeeName: 'Mike Employee',
      currentStage: 'intent',
      lastActivity: '2024-01-15',
      totalVisits: 3,
      daysInStage: 5
    },
    {
      schoolId: 'school-2',
      schoolName: 'Riverside Academy',
      employeeName: 'Sarah Johnson',
      currentStage: 'interest',
      lastActivity: '2024-01-14',
      totalVisits: 1,
      daysInStage: 2
    },
    {
      schoolId: 'school-3',
      schoolName: 'Sunset Elementary',
      employeeName: 'Mike Employee',
      currentStage: 'decision_yes',
      lastActivity: '2024-01-10',
      totalVisits: 5,
      daysInStage: 1
    },
    {
      schoolId: 'school-4',
      schoolName: 'Oakwood International',
      employeeName: 'Sarah Johnson',
      currentStage: 'consideration',
      lastActivity: '2024-01-12',
      totalVisits: 4,
      daysInStage: 8
    },
    {
      schoolId: 'school-5',
      schoolName: 'Pine Valley School',
      employeeName: 'Mike Employee',
      currentStage: 'awareness',
      lastActivity: '2024-01-16',
      totalVisits: 1,
      daysInStage: 1
    }
  ]);

  // Calculate statistics
  const stats = {
    totalSchools: funnelData.length,
    closedWon: funnelData.filter(item => item.currentStage === 'decision_yes').length,
    inProgress: funnelData.filter(item => !['decision_yes', 'decision_no'].includes(item.currentStage)).length,
    conversionRate: Math.round((funnelData.filter(item => item.currentStage === 'decision_yes').length / funnelData.length) * 100)
  };

  // Group by funnel stage for overview
  const stageBreakdown = FUNNEL_STAGES.map(stage => ({
    ...stage,
    count: funnelData.filter(item => item.currentStage === stage.value).length
  }));

  const filteredData = funnelData.filter(item => {
    const matchesSearch = item.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || item.currentStage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const getStageInfo = (stage: FunnelStage) => {
    return FUNNEL_STAGES.find(s => s.value === stage) || FUNNEL_STAGES[0];
  };

  const getProgressPercentage = (stage: FunnelStage) => {
    const stageIndex = FUNNEL_STAGES.findIndex(s => s.value === stage);
    return ((stageIndex + 1) / FUNNEL_STAGES.length) * 100;
  };

  const getDaysColor = (days: number) => {
    if (days <= 3) return 'text-success';
    if (days <= 7) return 'text-warning';
    return 'text-destructive';
  };

  const exportColumns = [
    { key: 'schoolName', label: 'School Name', width: 30 },
    { key: 'employeeName', label: 'Employee', width: 25 },
    { key: 'currentStage', label: 'Current Stage', width: 25 },
    { key: 'lastActivity', label: 'Last Activity', width: 20 },
    { key: 'totalVisits', label: 'Total Visits', width: 15 },
    { key: 'daysInStage', label: 'Days in Stage', width: 15 }
  ];

  const exportData = filteredData.map(item => ({
    ...item,
    currentStage: getStageInfo(item.currentStage).label,
    lastActivity: new Date(item.lastActivity).toLocaleDateString()
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funnel Progress</h1>
          <p className="text-muted-foreground">
            Track school progression through your sales funnel
          </p>
        </div>
        <ExportButton 
          data={exportData}
          filename="funnel-progress"
          columns={exportColumns}
          title="Funnel Progress Report"
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchools}</div>
            <p className="text-xs text-muted-foreground">In funnel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closedWon}</div>
            <p className="text-xs text-muted-foreground">Successful deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active prospects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Stage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Funnel Stage Distribution</CardTitle>
          <CardDescription>Number of schools at each stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stageBreakdown.map((stage) => (
              <div key={stage.value} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stage.color} mb-2`}>
                  <span className="font-bold text-lg">{stage.count}</span>
                </div>
                <p className="text-sm font-medium">{stage.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search schools or employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={stageFilter} onValueChange={(value: FunnelStage | 'all') => setStageFilter(value)}>
          <SelectTrigger className="w-[180px]">
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
      </div>

      {/* Detailed List */}
      <div className="space-y-4">
        {filteredData.map((item) => {
          const stageInfo = getStageInfo(item.currentStage);
          const progress = getProgressPercentage(item.currentStage);
          
          return (
            <Card key={item.schoolId} className="hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.schoolName}</h3>
                    <p className="text-sm text-muted-foreground">Assigned to: {item.employeeName}</p>
                  </div>
                  <Badge className={stageInfo.color}>
                    {stageInfo.label}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Funnel Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-4">
                      <span>
                        <strong>Total Visits:</strong> {item.totalVisits}
                      </span>
                      <span>
                        <strong>Last Activity:</strong> {new Date(item.lastActivity).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`font-medium ${getDaysColor(item.daysInStage)}`}>
                      {item.daysInStage} day{item.daysInStage !== 1 ? 's' : ''} in stage
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm || stageFilter !== 'all' 
                ? 'No schools found matching your filters.'
                : 'No schools in the funnel yet.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FunnelProgress;