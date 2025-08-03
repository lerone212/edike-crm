import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Activity,
  Filter,
  Download,
  Search,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import AccountDropdown from '@/components/auth/AccountDropdown';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'it_support', 'employee'] },
    { name: 'Assign Schools', href: '/assign-schools', icon: School, roles: ['super_admin'] },
    { name: 'Visit Log', href: '/visit-log', icon: FileText, roles: ['employee'] },
    { name: 'Calendar', href: '/calendar', icon: Activity, roles: ['super_admin', 'employee'] },
    { name: 'Schools', href: '/schools', icon: School, roles: ['super_admin', 'it_support', 'employee'] },
    { name: 'Sales Funnel', href: '/sales-funnel', icon: TrendingUp, roles: ['super_admin', 'employee'] },
    { name: 'User Management', href: '/user-management', icon: Users, roles: ['it_support'] },
    { name: 'Funnel Progress', href: '/funnel-progress', icon: LayoutDashboard, roles: ['super_admin'] },
    { name: 'Activity Logs', href: '/activity-logs', icon: Activity, roles: ['super_admin'] },
  ];

  // Mock notifications count - will be replaced with real data from Django
  const notificationCount = 3;

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="min-h-screen bg-gradient-accent">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-strong transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        
        {/* Mobile close button */}
        <div className="flex justify-end p-4 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:bg-accent"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* User info */}
        <div className="p-4 border-b bg-accent/30">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">{user?.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
              <Badge variant="secondary" className="text-xs mt-1 capitalize">
                {user?.role?.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredNavigation.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => {
                navigate(item.href);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="professional-gradient shadow-soft border-b px-4 py-2 lg:px-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover-scale"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
            </div>
            
            {/* Top bar actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <NotificationDropdown />
              
              {/* Account Dropdown */}
              <AccountDropdown />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto">{/* Reduced all padding */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;