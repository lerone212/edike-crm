import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Phone, Mail, Users, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { School, User as UserType } from '@/types/auth';
import ExportButton from '@/components/export/ExportButton';
import AddSchoolModal from '@/components/schools/AddSchoolModal';

const Schools = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewFilter, setViewFilter] = useState<'all' | 'assigned'>('assigned');

  // Mock data - in real app, this would come from API
  const [schools, setSchools] = useState<School[]>([
    {
      id: 'school-1',
      name: 'Greenfield High School',
      address: '123 Education St, City, State 12345',
      contact: { 
        phone: '+1 (555) 123-4567', 
        email: 'admin@greenfield.edu', 
        principalName: 'Dr. Smith' 
      },
      assignedEmployees: ['emp-1'],
      totalStudents: 1200,
      createdAt: '2024-01-01'
    },
    {
      id: 'school-2',
      name: 'Riverside Academy',
      address: '456 Learning Ave, Town, State 12346',
      contact: { 
        phone: '+1 (555) 234-5678', 
        email: 'info@riverside.edu', 
        principalName: 'Ms. Johnson' 
      },
      assignedEmployees: ['emp-2'],
      totalStudents: 800,
      createdAt: '2024-01-02'
    },
    {
      id: 'school-3',
      name: 'Sunset Elementary',
      address: '789 Knowledge Rd, Village, State 12347',
      contact: { 
        phone: '+1 (555) 345-6789', 
        email: 'contact@sunset.edu', 
        principalName: 'Mr. Brown' 
      },
      assignedEmployees: ['emp-1', 'emp-2'],
      totalStudents: 500,
      createdAt: '2024-01-03'
    },
    {
      id: 'school-4',
      name: 'Oakwood International School',
      address: '321 Global Blvd, Metro, State 12348',
      contact: { 
        phone: '+1 (555) 456-7890', 
        email: 'admissions@oakwood.edu', 
        principalName: 'Dr. Davis' 
      },
      assignedEmployees: [],
      totalStudents: 950,
      createdAt: '2024-01-04'
    }
  ]);

  const [employees] = useState<UserType[]>([
    {
      id: 'emp-1',
      email: 'mike@edike.com',
      name: 'Mike Employee',
      role: 'employee',
      isActive: true,
      assignedSchools: ['school-1'],
      createdAt: '2024-01-01'
    },
    {
      id: 'emp-2',
      email: 'sarah@edike.com',
      name: 'Sarah Johnson',
      role: 'employee',
      isActive: true,
      assignedSchools: ['school-2'],
      createdAt: '2024-01-01'
    }
  ]);

  // Filter schools based on user role and view filter
  const getFilteredSchools = () => {
    let filtered = schools;
    
    // Apply view filter for employees
    if (user?.role === 'employee') {
      if (viewFilter === 'assigned') {
        filtered = schools.filter(school => 
          school.assignedEmployees.includes(user.id)
        );
      }
      // If 'all' is selected, show all schools
    } else if (user?.role === 'super_admin') {
      // Super admin always sees all schools
      filtered = schools;
    }

    // Apply search filter
    return filtered.filter(school =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.contact.principalName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || 'Unknown';
  };

  const handleAddSchool = (newSchool: Omit<School, 'id' | 'createdAt'>) => {
    const schoolWithId: School = {
      ...newSchool,
      id: `school-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSchools(prev => [...prev, schoolWithId]);
  };

  const exportColumns = [
    { key: 'name', label: 'School Name', width: 30 },
    { key: 'address', label: 'Address', width: 40 },
    { key: 'contact.principalName', label: 'Principal', width: 25 },
    { key: 'contact.phone', label: 'Phone', width: 20 },
    { key: 'contact.email', label: 'Email', width: 30 },
    { key: 'totalStudents', label: 'Total Students', width: 15 },
    { key: 'assignedEmployeesCount', label: 'Assigned Employees', width: 20 }
  ];

  const filteredSchools = getFilteredSchools();

  const exportData = filteredSchools.map(school => ({
    ...school,
    'contact.principalName': school.contact.principalName || 'N/A',
    'contact.phone': school.contact.phone || 'N/A', 
    'contact.email': school.contact.email || 'N/A',
    assignedEmployeesCount: school.assignedEmployees.length
  }));

  const handleViewDetails = (schoolId: string) => {
    navigate(`/schools/${schoolId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schools</h1>
          <p className="text-muted-foreground">
            {user?.role === 'employee' 
              ? viewFilter === 'assigned' 
                ? 'View your assigned schools and their details'
                : 'View all schools in the system'
              : 'Manage and view all schools in the system'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {user?.role === 'super_admin' && (
            <AddSchoolModal onAddSchool={handleAddSchool} />
          )}
          <ExportButton 
            data={exportData}
            filename="schools"
            columns={exportColumns}
            title="Schools Report"
          />
        </div>
      </div>

      {/* Filter Tabs for Employees */}
      {user?.role === 'employee' && (
        <Tabs value={viewFilter} onValueChange={(value: 'all' | 'assigned') => setViewFilter(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="assigned">My Schools</TabsTrigger>
            <TabsTrigger value="all">All Schools</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Search and Stats */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredSchools.length} school{filteredSchools.length !== 1 ? 's' : ''}
          {user?.role === 'employee' && viewFilter === 'assigned' && ' assigned to you'}
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.length > 0 ? (
          filteredSchools.map((school) => (
            <Card key={school.id} className="hover:shadow-medium transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{school.name}</CardTitle>
                <CardDescription className="flex items-start space-x-1">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>{school.address}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Principal:</strong> {school.contact.principalName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{school.contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{school.contact.email}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-sm">
                  <p><strong>Total Students:</strong> {school.totalStudents?.toLocaleString()}</p>
                </div>

                {/* Assigned Employees */}
                <div>
                  <p className="text-sm font-medium mb-2">Assigned To:</p>
                  {school.assignedEmployees.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {school.assignedEmployees.map((empId) => (
                        <Badge key={empId} variant="secondary" className="text-xs">
                          {getEmployeeName(empId)}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not assigned</p>
                  )}
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleViewDetails(school.id)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'No schools found matching your search.'
                    : user?.role === 'employee'
                      ? viewFilter === 'assigned'
                        ? 'No schools assigned to you yet.'
                        : 'No schools in the system yet.'
                      : 'No schools in the system yet.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schools;