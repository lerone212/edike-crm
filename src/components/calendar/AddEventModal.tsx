import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import AddSchoolModal from '@/components/schools/AddSchoolModal';
import { School } from '@/types/auth';

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

interface AddEventModalProps {
  onAddEvent: (event: Omit<Meeting, 'id'>) => void;
  isAdminView?: boolean;
  onAddSchool?: (school: Omit<School, 'id' | 'createdAt'>) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ onAddEvent, isAdminView, onAddSchool }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    schoolName: '',
    employeeId: user?.id || '',
    employeeName: user?.name || '',
    time: '',
    type: 'meeting' as 'meeting' | 'proposal_deadline',
    status: 'scheduled' as 'scheduled' | 'completed' | 'missed',
    notes: ''
  });

  const employees = [
    { id: 'emp-1', name: 'John Doe' },
    { id: 'emp-2', name: 'Jane Smith' },
    { id: 'emp-3', name: 'Mike Johnson' }
  ];

  const handleAddSchool = (newSchool: Omit<School, 'id' | 'createdAt'>) => {
    if (onAddSchool) {
      onAddSchool(newSchool);
      // Auto-set the newly added school name
      setFormData(prev => ({ ...prev, schoolName: newSchool.name }));
      setShowAddSchool(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !formData.schoolName || !formData.time) {
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
    
    const newEvent: Omit<Meeting, 'id'> = {
      schoolId: `school-${Date.now()}`,
      schoolName: formData.schoolName,
      employeeId: formData.employeeId,
      employeeName: selectedEmployee?.name || formData.employeeName,
      date: format(date, 'yyyy-MM-dd'),
      time: formData.time,
      type: formData.type,
      status: formData.status,
      notes: formData.notes
    };

    onAddEvent(newEvent);
    
    // Reset form
    setFormData({
      schoolName: '',
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      time: '',
      type: 'meeting',
      status: 'scheduled',
      notes: ''
    });
    setDate(undefined);
    setOpen(false);
  };

  const handleEmployeeChange = (employeeId: string) => {
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    setFormData(prev => ({
      ...prev,
      employeeId,
      employeeName: selectedEmployee?.name || ''
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Event</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolName">School Name</Label>
            <div className="flex space-x-2">
              <Input
                id="schoolName"
                value={formData.schoolName}
                onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                placeholder="Enter school name"
                required
                className="flex-1"
              />
              {onAddSchool && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddSchool(true)}
                  className="px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {isAdminView && (
            <div className="space-y-2">
              <Label htmlFor="employee">Assign to Employee</Label>
              <Select value={formData.employeeId} onValueChange={handleEmployeeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: 'meeting' | 'proposal_deadline') => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="proposal_deadline">Proposal Deadline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'scheduled' | 'completed' | 'missed') => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Event
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Add School Modal */}
      {onAddSchool && (
        <AddSchoolModal 
          open={showAddSchool}
          onOpenChange={setShowAddSchool}
          onAddSchool={handleAddSchool}
        />
      )}
    </Dialog>
  );
};

export default AddEventModal;