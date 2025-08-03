import React, { useState } from 'react';
import { User, Settings, LogOut, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from './ChangePasswordModal';

interface AccountDropdownProps {
  className?: string;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsVisible(false);
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
    setIsVisible(false);
  };

  return (
    <>
      <div 
        className={`relative ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {/* User Avatar Trigger */}
        <div className="relative cursor-pointer">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Dropdown */}
        {isVisible && (
          <div className="absolute right-0 top-10 z-50 w-72 animate-in fade-in-0 zoom-in-95">
            <Card className="shadow-strong border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{user?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    <Badge variant="secondary" className="text-xs mt-1 capitalize">
                      {user?.role?.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="space-y-1">
                  {/* Account Settings */}
                  <div className="px-4 py-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Account</h4>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={handleChangePassword}
                    >
                      <Lock className="h-4 w-4 mr-3" />
                      <div>
                        <div className="text-sm font-medium">Change Password</div>
                        <div className="text-xs text-muted-foreground">Update your password</div>
                      </div>
                    </Button>
                  </div>

                  <Separator />

                  {/* Profile Information */}
                  <div className="px-4 py-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Profile</h4>
                    <div className="space-y-2 text-sm">
                      {user?.assignedSchools && user.assignedSchools.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Assigned Schools:</span>
                          <span className="font-medium">{user.assignedSchools.length}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Logout */}
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        open={showChangePassword} 
        onOpenChange={setShowChangePassword} 
      />
    </>
  );
};

export default AccountDropdown;