import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, 
  Clock, 
  AlertTriangle, 
  Calendar,
  School,
  CheckCircle,
  X
} from 'lucide-react';

// Mock notifications - will be replaced with Django API calls
const mockNotifications = [
  {
    id: '1',
    type: 'reminder',
    title: 'Visit Reminder',
    message: 'Follow-up visit scheduled for Lagos High School today at 2:00 PM',
    timestamp: '2024-01-15 14:00:00',
    isRead: false,
    priority: 'high',
    school: 'Lagos High School'
  },
  {
    id: '2',
    type: 'overdue',
    title: 'Overdue Follow-up',
    message: 'Abuja Technical College has been pending follow-up for 5 days',
    timestamp: '2024-01-15 13:30:00',
    isRead: false,
    priority: 'urgent',
    school: 'Abuja Technical College'
  },
  {
    id: '3',
    type: 'assignment',
    title: 'New School Assignment',
    message: 'You have been assigned to Port Harcourt Academy',
    timestamp: '2024-01-15 12:45:00',
    isRead: true,
    priority: 'medium',
    school: 'Port Harcourt Academy'
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'reminder': return <Clock className="h-4 w-4 text-warning" />;
    case 'overdue': return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case 'assignment': return <School className="h-4 w-4 text-primary" />;
    case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
    default: return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
    case 'high': return <Badge variant="outline" className="text-warning border-warning">High</Badge>;
    case 'medium': return <Badge variant="outline" className="text-info border-info">Medium</Badge>;
    case 'low': return <Badge variant="outline">Low</Badge>;
    default: return <Badge variant="outline">Normal</Badge>;
  }
};

interface NotificationsPanelProps {
  onClose?: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <Card className="w-80 max-h-96 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 max-h-80 overflow-y-auto">
        <div className="divide-y">
          {mockNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 hover:bg-accent/50 transition-colors ${
                !notification.isRead ? 'bg-accent/20' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {notification.title}
                    </p>
                    {getPriorityBadge(notification.priority)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(notification.timestamp).toLocaleString()}</span>
                    {!notification.isRead && (
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t bg-accent/20">
          <Button variant="outline" size="sm" className="w-full">
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;