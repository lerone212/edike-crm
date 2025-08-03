import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, Clock, MessageSquare, Download, Edit } from 'lucide-react';
import { format } from 'date-fns';
import VisitLogModal from '@/components/visits/VisitLogModal';
import EditVisitModal from '@/components/visits/EditVisitModal';
import { useAuth } from '@/contexts/AuthContext';
import { Visit, School, FUNNEL_STAGES, FunnelStage } from '@/types/auth';
import ExportButton from '@/components/export/ExportButton';

const VisitLog = () => {
  const { user } = useAuth();
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from API
  const [visits, setVisits] = useState<Visit[]>([
    {
      id: 'visit-1',
      schoolId: 'school-1',
      employeeId: user?.id || '',
      date: '2024-01-15',
      time: '10:30',
      comments: 'Met with principal to discuss financing options. Very interested in our services.',
      funnelStage: 'intent',
      nextStep: {
        action: 'Schedule proposal review meeting',
        scheduleDate: '2024-01-20',
        scheduleTime: '14:00'
      },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'visit-2',
      schoolId: 'school-2',
      employeeId: user?.id || '',
      date: '2024-01-14',
      time: '14:00',
      comments: 'Initial contact made. School admin requested more information about our program.',
      funnelStage: 'interest',
      nextStep: {
        action: 'Send pricing / product sheet',
        scheduleDate: '2024-01-16',
        scheduleTime: '09:00'
      },
      createdAt: '2024-01-14T14:00:00Z'
    }
  ]);

  const [schools] = useState<School[]>([
    {
      id: 'school-1',
      name: 'Greenfield High School',
      address: '123 Education St, City',
      contact: { phone: '+1234567890', email: 'admin@greenfield.edu', principalName: 'Dr. Smith' },
      assignedEmployees: [user?.id || ''],
      totalStudents: 1200,
      createdAt: '2024-01-01'
    },
    {
      id: 'school-2',
      name: 'Riverside Academy', 
      address: '456 Learning Ave, Town',
      contact: { phone: '+1234567891', email: 'info@riverside.edu', principalName: 'Ms. Johnson' },
      assignedEmployees: [user?.id || ''],
      totalStudents: 800,
      createdAt: '2024-01-02'
    }
  ]);

  const getSchoolName = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    return school?.name || 'Unknown School';
  };

  const getStageInfo = (stage: string) => {
    return FUNNEL_STAGES.find(s => s.value === stage) || FUNNEL_STAGES[0];
  };

  const filteredVisits = visits.filter(visit => {
    const schoolName = getSchoolName(visit.schoolId);
    return schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           visit.comments.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const exportColumns = [
    { key: 'date', label: 'Date', width: 15 },
    { key: 'time', label: 'Time', width: 15 },
    { key: 'schoolName', label: 'School', width: 30 },
    { key: 'funnelStageLabel', label: 'Stage', width: 20 },
    { key: 'comments', label: 'Comments', width: 50 },
    { key: 'employeeName', label: 'Employee', width: 25 }
  ];

  const exportData = filteredVisits.map(visit => ({
    ...visit,
    schoolName: getSchoolName(visit.schoolId),
    funnelStageLabel: getStageInfo(visit.funnelStage).label,
    employeeName: user?.name || 'Unknown'
  }));

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "School,Date,Time,Comments,Stage,Employee\n"
      + filteredVisits.map(visit => 
          `"${getSchoolName(visit.schoolId)}","${visit.date}","${visit.time}","${visit.comments}","${getStageInfo(visit.funnelStage).label}","${user?.name}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `visit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogVisit = (visit: Omit<Visit, 'id' | 'createdAt'>) => {
    const newVisit: Visit = {
      ...visit,
      id: `visit-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setVisits([newVisit, ...visits]);
  };

  const handleUpdateVisit = (visitId: string, updates: { 
    comments: string; 
    funnelStage: FunnelStage; 
    nextStep: {
      action: string;
      scheduleDate: string;
      scheduleTime: string;
    };
  }) => {
    setVisits(visits.map(visit => 
      visit.id === visitId 
        ? { ...visit, ...updates }
        : visit
    ));
  };

  const handleEditVisit = (visit: Visit) => {
    setSelectedVisit(visit);
    setEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Visit Log</h1>
          <p className="text-muted-foreground">
            Record and track your school visits and interactions
          </p>
        </div>
        <div className="flex space-x-2">
          <ExportButton 
            data={exportData}
            filename="visit-log"
            columns={exportColumns}
            title="Visit Log Report"
          />
          <Button onClick={() => setVisitModalOpen(true)} className="animate-fade-in">
            <Plus className="mr-2 h-4 w-4" />
            Log Visit
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search visits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Visits List */}
      <div className="space-y-4">
        {filteredVisits.length > 0 ? (
          filteredVisits.map((visit) => {
            const stageInfo = getStageInfo(visit.funnelStage);
            return (
              <Card key={visit.id} className="hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{getSchoolName(visit.schoolId)}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {visit.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {visit.time}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={stageInfo.color}>
                      {stageInfo.label}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditVisit(visit)}
                      className="ml-auto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                    <p className="text-sm text-foreground">{visit.comments}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No visits logged yet. Start by logging your first visit!</p>
            </CardContent>
          </Card>
        )}
      </div>

      <VisitLogModal
        open={visitModalOpen}
        onOpenChange={setVisitModalOpen}
        schools={schools}
        employeeId={user?.id || ''}
        onLogVisit={handleLogVisit}
      />
      
      <EditVisitModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        visit={selectedVisit}
        onUpdateVisit={handleUpdateVisit}
      />
    </div>
  );
};

export default VisitLog;