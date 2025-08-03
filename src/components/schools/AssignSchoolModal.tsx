import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, School } from '@/types/auth';

interface AssignSchoolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: User[];
  schools: School[];
  onAssign: (schoolId: string, employeeId: string) => void;
}

const AssignSchoolModal: React.FC<AssignSchoolModalProps> = ({
  open,
  onOpenChange,
  employees,
  schools,
  onAssign
}) => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSchool || !selectedEmployee) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select both a school and an employee.",
      });
      return;
    }

    onAssign(selectedSchool, selectedEmployee);
    
    toast({
      title: "School assigned successfully",
      description: "The school has been assigned to the selected employee.",
    });

    // Reset form
    setSelectedSchool('');
    setSelectedEmployee('');
    onOpenChange(false);
  };

  const availableEmployees = employees.filter(emp => emp.role === 'employee' && emp.isActive);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign School to Employee</DialogTitle>
          <DialogDescription>
            Select a school and assign it to an employee for visits and follow-ups.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger>
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {availableEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} ({employee.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Assign School
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignSchoolModal;