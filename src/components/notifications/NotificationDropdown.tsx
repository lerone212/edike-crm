import React, { useState } from 'react';
import { Bell, CheckCircle, Clock, AlertTriangle, School } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'reminder' | 'overdue' | 'assignment' | 'completed';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  school?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Visit Reminder',
    message: 'Follow-up visit scheduled for Lagos High School today at 2:00 PM',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    priority: 'high',
    school: 'Lagos High School'
  },
  {
    id: '2',
    type: 'overdue',
    title: 'Overdue Follow-up',
    message: 'Abuja Technical College has been pending follow-up for 5 days',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    isRead: false,
    priority: 'urgent',
    school: 'Abuja Technical College'
  },
  {
    id: '3',
    type: 'assignment',
    title: 'New School Assignment',
    message: 'Port Harcourt Academy has been assigned to you',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
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
    case 'high': return <Badge variant="secondary">High</Badge>;
    case 'medium': return <Badge variant="outline">Medium</Badge>;
    case 'low': return <Badge variant="outline" className="text-muted-foreground">Low</Badge>;
    default: return null;
  }
};

interface NotificationDropdownProps {
  className?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [notifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Bell Icon Trigger */}
      <div className="relative">
        <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isVisible && (
        <div className="absolute right-0 top-8 z-50 w-80 animate-in fade-in-0 zoom-in-95">
          <Card className="shadow-strong border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Notifications</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {unreadCount} new
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-border/50 hover:bg-accent/50 transition-colors cursor-pointer ${
                          !notification.isRead ? 'bg-accent/30' : ''
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
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              {notification.school && (
                                <p className="text-xs text-primary font-medium">
                                  {notification.school}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          {!notification.isRead && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-3 border-t border-border/50">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;