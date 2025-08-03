import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, UserCheck, UserX, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User, UserRole } from '@/types/auth';
import ExportButton from '@/components/export/ExportButton';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const { toast } = useToast();

  // Form state for new user
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'employee' as UserRole
  });

  // Mock data - in real app, this would come from API
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'ceo@edike.com',
      name: 'John CEO',
      role: 'super_admin',
      isActive: true,
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15'
    },
    {
      id: '2',
      email: 'it@edike.com',
      name: 'Sarah IT',
      role: 'it_support',
      isActive: true,
      createdAt: '2024-01-01',
      lastLogin: '2024-01-14'
    },
    {
      id: '3',
      email: 'mike@edike.com',
      name: 'Mike Employee',
      role: 'employee',
      isActive: true,
      assignedSchools: ['school-1', 'school-2'],
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15'
    },
    {
      id: '4',
      email: 'sarah@edike.com',
      name: 'Sarah Johnson',
      role: 'employee',
      isActive: false,
      assignedSchools: [],
      createdAt: '2024-01-01',
      lastLogin: '2024-01-10'
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const user: User = {
      id: `user-${Date.now()}`,
      ...newUser,
      isActive: true,
      createdAt: new Date().toISOString(),
      assignedSchools: []
    };

    setUsers([...users, user]);
    
    toast({
      title: "User added successfully",
      description: `${user.name} has been added to the system.`,
    });

    setNewUser({ name: '', email: '', role: 'employee' });
    setAddUserOpen(false);
  };

  const handleToggleActive = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: `User ${user?.isActive ? 'deactivated' : 'activated'}`,
      description: `${user?.name} has been ${user?.isActive ? 'deactivated' : 'activated'}.`,
    });
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, role: newRole }
        : user
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: "Role updated",
      description: `${user?.name}'s role has been changed to ${newRole.replace('_', ' ')}.`,
    });
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      super_admin: 'bg-red-100 text-red-800',
      it_support: 'bg-blue-100 text-blue-800',
      employee: 'bg-green-100 text-green-800'
    };
    return colors[role];
  };

  const getRoleLabel = (role: UserRole) => {
    return role.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const exportColumns = [
    { key: 'name', label: 'Full Name', width: 25 },
    { key: 'email', label: 'Email', width: 30 },
    { key: 'role', label: 'Role', width: 20 },
    { key: 'isActive', label: 'Status', width: 15 },
    { key: 'createdAt', label: 'Created', width: 20 },
    { key: 'lastLogin', label: 'Last Login', width: 20 },
    { key: 'assignedSchoolsCount', label: 'Assigned Schools', width: 15 }
  ];

  const exportData = filteredUsers.map(user => ({
    ...user,
    role: getRoleLabel(user.role),
    isActive: user.isActive ? 'Active' : 'Inactive',
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
    lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
    assignedSchoolsCount: user.assignedSchools?.length || 0
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <ExportButton 
            data={exportData}
            filename="users"
            columns={exportColumns}
            title="User Management Report"
          />
          
          <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="animate-fade-in">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="animate-scale-in">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account and assign their role.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="it_support">IT Support</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setAddUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>
                    Add User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover-scale animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-foreground">{user.name}</h3>
                      {user.isActive ? (
                        <UserCheck className="h-4 w-4 text-success" />
                      ) : (
                        <UserX className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getRoleColor(user.role)}>
                        <Shield className="mr-1 h-3 w-3" />
                        {getRoleLabel(user.role)}
                      </Badge>
                      {user.assignedSchools && user.assignedSchools.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {user.assignedSchools.length} school{user.assignedSchools.length !== 1 ? 's' : ''} assigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Role Selection */}
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm">Role:</Label>
                    <Select 
                      value={user.role} 
                      onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="it_support">IT Support</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm">Active:</Label>
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => handleToggleActive(user.id)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? 'No users found matching your search.' : 'No users in the system.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;