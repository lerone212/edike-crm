import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Clock, User, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AddEventModal from './AddEventModal';
import ExportButton from '@/components/export/ExportButton';

interface Meeting {
  id: string;
  schoolId: string;
  schoolName: string;
  employeeId: string;
  employeeName: string;
  date: string;
  time: string;
  type: 'meeting' | 'proposal_deadline';
  status: 'scheduled' | 'completed' | 'missed';
  notes?: string;
}

interface CalendarModuleProps {
  isAdminView?: boolean;
}

const CalendarModule: React.FC<CalendarModuleProps> = ({ isAdminView = false }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [viewType, setViewType] = useState<'calendar' | 'list'>('calendar');

  // Mock data - in real app, this would come from API
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 'meeting-1',
      schoolId: 'school-1',
      schoolName: 'Greenfield High School',
      employeeId: 'emp-1',
      employeeName: 'John Doe',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:00',
      type: 'meeting',
      status: 'scheduled',
      notes: 'Initial presentation about our services'
    },
    {
      id: 'meeting-2',
      schoolId: 'school-2',
      schoolName: 'Riverside Academy',
      employeeId: 'emp-1',
      employeeName: 'John Doe',
      date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      time: '14:00',
      type: 'proposal_deadline',
      status: 'scheduled',
      notes: 'Proposal submission deadline'
    },
    {
      id: 'meeting-3',
      schoolId: 'school-3',
      schoolName: 'Oak Valley School',
      employeeId: 'emp-2',
      employeeName: 'Jane Smith',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      time: '11:30',
      type: 'meeting',
      status: 'scheduled',
      notes: 'Follow-up meeting to discuss contract details'
    }
  ]);

  const employees = [
    { id: 'emp-1', name: 'John Doe' },
    { id: 'emp-2', name: 'Jane Smith' },
    { id: 'emp-3', name: 'Mike Johnson' }
  ];

  const filteredMeetings = meetings.filter(meeting => {
    // For admin view, apply employee filter
    if (isAdminView && selectedEmployee !== 'all' && meeting.employeeId !== selectedEmployee) return false;
    // For regular employees, show all meetings (team calendar)
    return true;
  });

  const getMeetingsForDate = (date: Date) => {
    return filteredMeetings.filter(meeting => 
      isSameDay(new Date(meeting.date), date)
    );
  };

  const getSelectedDateMeetings = () => {
    return getMeetingsForDate(selectedDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'meeting' ? <User className="h-4 w-4" /> : <Clock className="h-4 w-4" />;
  };

  const dayHasMeetings = (date: Date) => {
    return getMeetingsForDate(date).length > 0;
  };

  const handleAddEvent = (newEvent: Omit<Meeting, 'id'>) => {
    const eventWithId = {
      ...newEvent,
      id: `meeting-${Date.now()}`
    };
    setMeetings(prev => [...prev, eventWithId]);
  };

  const exportColumns = [
    { key: 'date', label: 'Date', width: 15 },
    { key: 'time', label: 'Time', width: 15 },
    { key: 'schoolName', label: 'School', width: 30 },
    { key: 'employeeName', label: 'Employee', width: 25 },
    { key: 'type', label: 'Event Type', width: 20 },
    { key: 'status', label: 'Status', width: 15 },
    { key: 'notes', label: 'Notes', width: 40 }
  ];

  const exportData = filteredMeetings.map(meeting => ({
    ...meeting,
    type: meeting.type === 'meeting' ? 'Meeting' : 'Proposal Deadline'
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Team Calendar
          </h2>
          <p className="text-muted-foreground">
            View all team meetings and proposal deadlines
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
            <ExportButton 
              data={exportData}
              filename="calendar-events"
              columns={exportColumns}
              title="Team Calendar Events"
            />
          
          <AddEventModal onAddEvent={handleAddEvent} isAdminView={isAdminView} />
          
          {isAdminView && (
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Select value={viewType} onValueChange={(value: 'calendar' | 'list') => setViewType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calendar">Calendar</SelectItem>
              <SelectItem value="list">List</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewType === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="w-full overflow-auto">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border p-3 pointer-events-auto w-full min-w-[280px] mx-auto"
                  modifiers={{
                    hasMeetings: (date) => dayHasMeetings(date)
                  }}
                  modifiersStyles={{
                    hasMeetings: {
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      color: 'hsl(var(--primary))',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {format(selectedDate, 'MMMM d, yyyy')}
              </CardTitle>
              <CardDescription>
                {getSelectedDateMeetings().length} event(s) scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getSelectedDateMeetings().length > 0 ? (
                  getSelectedDateMeetings().map((meeting) => (
                    <div key={meeting.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(meeting.type)}
                          <span className="font-medium text-sm">{meeting.time}</span>
                        </div>
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="font-medium text-sm">{meeting.schoolName}</div>
                        <div className="text-xs text-muted-foreground">
                          {meeting.employeeName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {meeting.type === 'meeting' ? 'Meeting' : 'Proposal Deadline'}
                        </div>
                        {meeting.notes && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {meeting.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No events scheduled for this date
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* List View */
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMeetings.map((meeting) => (
                <div key={meeting.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(meeting.type)}
                        <div>
                          <div className="font-medium">{meeting.schoolName}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(meeting.date), 'MMM d, yyyy')} at {meeting.time}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{meeting.employeeName}</Badge>
                      <Badge className={getStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <Badge variant="secondary" className="mr-2">
                      {meeting.type === 'meeting' ? 'Meeting' : 'Proposal Deadline'}
                    </Badge>
                    {meeting.notes}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarModule;