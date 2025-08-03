import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Activity, 
  Search, 
  Filter, 
  Download,
  Calendar,
  User,
  School,
  Eye,
  Edit,
  Plus,
  Trash2
} from 'lucide-react';
import ExportButton from '@/components/export/ExportButton';

// Mock data - will be replaced with Django API calls
const mockActivityLogs = [
  {
    id: '1',
    action: 'School Visit Logged',
    user: 'Mike Employee',
    userRole: 'employee',
    target: 'Lagos High School',
    timestamp: '2024-01-15 14:30:00',
    details: 'Logged visit with principal meeting outcome',
    actionType: 'create',
    ip: '192.168.1.100'
  },
  {
    id: '2',
    action: 'School Assigned',
    user: 'John CEO',
    userRole: 'super_admin',
    target: 'Abuja Technical College',
    timestamp: '2024-01-15 13:45:00',
    details: 'Assigned school to Mike Employee',
    actionType: 'assign',
    ip: '192.168.1.101'
  },
  {
    id: '3',
    action: 'User Created',
    user: 'Sarah IT',
    userRole: 'it_support',
    target: 'New Employee Account',
    timestamp: '2024-01-15 12:20:00',
    details: 'Created new employee account for Jane Doe',
    actionType: 'create',
    ip: '192.168.1.102'
  },
  {
    id: '4',
    action: 'School Edited',
    user: 'Mike Employee',
    userRole: 'employee',
    target: 'Port Harcourt Academy',
    timestamp: '2024-01-15 11:15:00',
    details: 'Updated school contact information',
    actionType: 'edit',
    ip: '192.168.1.100'
  },
  {
    id: '5',
    action: 'Funnel Stage Updated',
    user: 'Mike Employee',
    userRole: 'employee',
    target: 'Kano State College',
    timestamp: '2024-01-15 10:30:00',
    details: 'Moved from Introduction to Follow-up stage',
    actionType: 'update',
    ip: '192.168.1.100'
  }
];

const getActionIcon = (actionType: string) => {
  switch (actionType) {
    case 'create': return <Plus className="h-4 w-4 text-success" />;
    case 'edit': return <Edit className="h-4 w-4 text-warning" />;
    case 'delete': return <Trash2 className="h-4 w-4 text-destructive" />;
    case 'view': return <Eye className="h-4 w-4 text-info" />;
    case 'assign': return <User className="h-4 w-4 text-secondary" />;
    case 'update': return <Activity className="h-4 w-4 text-primary" />;
    default: return <Activity className="h-4 w-4 text-muted-foreground" />;
  }
};

const getActionBadge = (actionType: string) => {
  switch (actionType) {
    case 'create': return <Badge variant="outline" className="text-success border-success">Create</Badge>;
    case 'edit': return <Badge variant="outline" className="text-warning border-warning">Edit</Badge>;
    case 'delete': return <Badge variant="outline" className="text-destructive border-destructive">Delete</Badge>;
    case 'view': return <Badge variant="outline" className="text-info border-info">View</Badge>;
    case 'assign': return <Badge variant="outline" className="text-secondary border-secondary">Assign</Badge>;
    case 'update': return <Badge variant="outline" className="text-primary border-primary">Update</Badge>;
    default: return <Badge variant="outline">Unknown</Badge>;
  }
};

const ActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredLogs = mockActivityLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || log.actionType === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const exportColumns = [
    { key: 'timestamp', label: 'Date & Time', width: 25 },
    { key: 'action', label: 'Action', width: 25 },
    { key: 'user', label: 'User', width: 20 },
    { key: 'userRole', label: 'Role', width: 15 },
    { key: 'target', label: 'Target', width: 25 },
    { key: 'actionType', label: 'Type', width: 15 },
    { key: 'ip', label: 'IP Address', width: 15 },
    { key: 'details', label: 'Details', width: 40 }
  ];

  const exportData = filteredLogs.map(log => ({
    ...log,
    timestamp: new Date(log.timestamp).toLocaleString(),
    userRole: log.userRole.replace('_', ' ')
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor all system activities for audit and compliance</p>
        </div>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activities ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(log.actionType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-foreground">{log.action}</p>
                        {getActionBadge(log.actionType)}
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </time>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${log.user}`} />
                        <AvatarFallback className="text-xs">
                          {log.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        <strong className="text-foreground">{log.user}</strong> ({log.userRole.replace('_', ' ')})
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        Target: <strong className="text-foreground">{log.target}</strong>
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>IP: {log.ip}</span>
                      <span>•</span>
                      <span>ID: {log.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogs;