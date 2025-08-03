import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, User } from 'lucide-react';
import AssignSchoolModal from '@/components/schools/AssignSchoolModal';
import { User as UserType, School } from '@/types/auth';

const AssignSchools = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from API
  const [schools] = useState<School[]>([
    {
      id: 'school-1',
      name: 'Greenfield High School',
      address: '123 Education St, City',
      contact: { phone: '+1234567890', email: 'admin@greenfield.edu', principalName: 'Dr. Smith' },
      assignedEmployees: ['emp-1'],
      totalStudents: 1200,
      createdAt: '2024-01-01'
    },
    {
      id: 'school-2', 
      name: 'Riverside Academy',
      address: '456 Learning Ave, Town',
      contact: { phone: '+1234567891', email: 'info@riverside.edu', principalName: 'Ms. Johnson' },
      assignedEmployees: [],
      totalStudents: 800,
      createdAt: '2024-01-02'
    },
    {
      id: 'school-3',
      name: 'Sunset Elementary',
      address: '789 Knowledge Rd, Village',
      contact: { phone: '+1234567892', email: 'contact@sunset.edu', principalName: 'Mr. Brown' },
      assignedEmployees: ['emp-1', 'emp-2'],
      totalStudents: 500,
      createdAt: '2024-01-03'
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
      assignedSchools: [],
      createdAt: '2024-01-01'
    }
  ]);

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignSchool = (schoolId: string, employeeId: string) => {
    // In real app, this would be an API call
    console.log('Assigning school', schoolId, 'to employee', employeeId);
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assign Schools</h1>
          <p className="text-muted-foreground">
            Manage school assignments for your team members
          </p>
        </div>
        <Button onClick={() => setAssignModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Assign School
        </Button>
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
        {filteredSchools.map((school) => (
          <Card key={school.id} className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{school.name}</CardTitle>
              <CardDescription>{school.address}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p><strong>Principal:</strong> {school.contact.principalName}</p>
                <p><strong>Students:</strong> {school.totalStudents?.toLocaleString()}</p>
                <p><strong>Phone:</strong> {school.contact.phone}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Assigned Employees:</p>
                {school.assignedEmployees.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {school.assignedEmployees.map((empId) => (
                      <Badge key={empId} variant="secondary" className="text-xs">
                        <User className="mr-1 h-3 w-3" />
                        {getEmployeeName(empId)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No employees assigned</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AssignSchoolModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        employees={employees}
        schools={schools}
        onAssign={handleAssignSchool}
      />
    </div>
  );
};

export default AssignSchools;