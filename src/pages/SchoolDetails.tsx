import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Calendar,
  MessageSquare,
  Plus,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import VisitLogModal from '@/components/visits/VisitLogModal';
import { School, Visit, User as UserType, FUNNEL_STAGES } from '@/types/auth';

const SchoolDetails = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [visitModalOpen, setVisitModalOpen] = useState(false);

  // Mock data - in real app, this would come from API
  const [school] = useState<School>({
    id: schoolId || '',
    name: 'Greenfield High School',
    address: '123 Education Street, Metro City, State 12345',
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'admin@greenfield.edu',
      principalName: 'Dr. Emily Smith'
    },
    assignedEmployees: ['emp-1', 'emp-2'],
    totalStudents: 1200,
    createdAt: '2024-01-01'
  });

  // Enhanced contact history with different interaction types
  const [contactHistory, setContactHistory] = useState([
    {
      id: 'contact-1',
      schoolId: schoolId || '',
      employeeId: 'emp-1',
      date: '2024-01-15',
      time: '10:30',
      type: 'in_person_meeting',
      subject: 'Initial Partnership Discussion',
      description: 'In-person meeting with Dr. Smith. Discussed financing options for student fees. Very receptive to our program. Principal mentioned budget planning for next semester.',
      funnelStage: 'meeting_set',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'contact-2',
      schoolId: schoolId || '',
      employeeId: 'emp-1',
      date: '2024-01-12',
      time: '16:45',
      type: 'email',
      subject: 'Proposal Document Sent',
      description: 'Sent detailed proposal document via email. Included pricing structure, implementation timeline, and student benefit analysis.',
      funnelStage: 'proposal_sent',
      createdAt: '2024-01-12T16:45:00Z'
    },
    {
      id: 'contact-3',
      schoolId: schoolId || '',
      employeeId: 'emp-1',
      date: '2024-01-10',
      time: '14:00',
      type: 'phone_call',
      subject: 'Follow-up Call - Proposal Discussion',
      description: 'Follow-up call to discuss proposal details. Answered questions about payment terms and partnership structure. Dr. Smith requested time to review with school board.',
      funnelStage: 'proposal_sent',
      createdAt: '2024-01-10T14:00:00Z'
    },
    {
      id: 'contact-4',
      schoolId: schoolId || '',
      employeeId: 'emp-2',
      date: '2024-01-08',
      time: '09:15',
      type: 'cold_call',
      subject: 'Initial Contact - Service Introduction',
      description: 'First contact made with school administration. Introduced Edike services and benefits for students. Scheduled follow-up meeting for next week.',
      funnelStage: 'contacted',
      createdAt: '2024-01-08T09:15:00Z'
    },
    {
      id: 'contact-5',
      schoolId: schoolId || '',
      employeeId: 'emp-2',
      date: '2024-01-05',
      time: '11:20',
      type: 'email',
      subject: 'Introduction Email',
      description: 'Sent introductory email to school administration explaining Edike\'s services and requesting a meeting to discuss partnership opportunities.',
      funnelStage: 'contacted',
      createdAt: '2024-01-05T11:20:00Z'
    }
  ]);

  const [employees] = useState<UserType[]>([
    {
      id: 'emp-1',
      email: 'mike@edike.com',
      name: 'Mike Employee',
      role: 'employee',
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: 'emp-2',
      email: 'sarah@edike.com',
      name: 'Sarah Johnson',
      role: 'employee',
      isActive: true,
      createdAt: '2024-01-01'
    }
  ]);

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || 'Unknown Employee';
  };

  const getStageInfo = (stage: string) => {
    return FUNNEL_STAGES.find(s => s.value === stage) || FUNNEL_STAGES[0];
  };

  const getCurrentStage = () => {
    if (contactHistory.length === 0) return FUNNEL_STAGES[0];
    const latestContact = contactHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    return getStageInfo(latestContact.funnelStage);
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'in_person_meeting': return <Users className="h-4 w-4 text-blue-600" />;
      case 'phone_call': return <Phone className="h-4 w-4 text-green-600" />;
      case 'email': return <Mail className="h-4 w-4 text-purple-600" />;
      case 'cold_call': return <Phone className="h-4 w-4 text-orange-600" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'in_person_meeting': return 'In-Person Meeting';
      case 'phone_call': return 'Phone Call';
      case 'email': return 'Email';
      case 'cold_call': return 'Cold Call';
      default: return 'Contact';
    }
  };

  const handleLogVisit = (visit: Omit<Visit, 'id' | 'createdAt'>) => {
    // Convert visit to contact history format
    const newContact = {
      id: `contact-${Date.now()}`,
      schoolId: visit.schoolId,
      employeeId: visit.employeeId,
      date: visit.date,
      time: visit.time,
      type: 'in_person_meeting',
      subject: 'Visit Logged',
      description: visit.comments,
      funnelStage: visit.funnelStage,
      createdAt: new Date().toISOString()
    };
    setContactHistory([newContact, ...contactHistory]);
  };

  const canLogVisit = user?.role === 'employee' && school.assignedEmployees.includes(user.id);
  const currentStage = getCurrentStage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/schools')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Schools
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{school.name}</h1>
          <p className="text-muted-foreground">School Details & Visit History</p>
        </div>
        {canLogVisit && (
          <Button onClick={() => setVisitModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Log Visit
          </Button>
        )}
      </div>

      {/* School Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{school.address}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Total Students</p>
                <p className="text-sm text-muted-foreground">{school.totalStudents?.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Added to System</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(school.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Principal</p>
                <p className="text-sm text-muted-foreground">{school.contact.principalName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{school.contact.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{school.contact.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Status & Assigned Employees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="font-medium">Funnel Stage:</span>
              <Badge className={currentStage.color}>
                {currentStage.label}
              </Badge>
            </div>
            {contactHistory.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Last activity: {new Date(contactHistory[0].createdAt).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {school.assignedEmployees.length > 0 ? (
              <div className="space-y-2">
                {school.assignedEmployees.map((empId) => (
                  <div key={empId} className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{getEmployeeName(empId)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No employees assigned</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Complete Contact History */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Contact History</CardTitle>
          <CardDescription>
            All interactions, communications, and activities with this school
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contactHistory.length > 0 ? (
            <div className="space-y-4">
              {contactHistory.map((contact) => {
                const stageInfo = getStageInfo(contact.funnelStage);
                return (
                  <div key={contact.id} className="border rounded-lg p-4 bg-accent/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getContactTypeIcon(contact.type)}
                        <div>
                          <div className="font-medium text-sm">
                            {contact.subject}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(contact.date).toLocaleDateString()} at {contact.time} • {getContactTypeLabel(contact.type)}
                          </div>
                        </div>
                      </div>
                      <Badge className={stageInfo.color}>
                        {stageInfo.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        By: {getEmployeeName(contact.employeeId)}
                      </span>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                      <p className="text-sm">{contact.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No contact history recorded yet. {canLogVisit && 'Log your first interaction to get started!'}
            </p>
          )}
        </CardContent>
      </Card>

      {canLogVisit && (
        <VisitLogModal
          open={visitModalOpen}
          onOpenChange={setVisitModalOpen}
          schools={[school]}
          employeeId={user?.id || ''}
          onLogVisit={handleLogVisit}
        />
      )}
    </div>
  );
};

export default SchoolDetails;