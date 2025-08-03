import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { School } from '@/types/auth';

interface AddSchoolModalProps {
  onAddSchool: (school: Omit<School, 'id' | 'createdAt'>) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({ 
  onAddSchool, 
  open: externalOpen, 
  onOpenChange: externalOnOpenChange 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { toast } = useToast();
  
  // Use external state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    principalName: '',
    phone: '',
    email: '',
    totalStudents: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in the school name and address.",
      });
      return;
    }

    const newSchool: Omit<School, 'id' | 'createdAt'> = {
      name: formData.name,
      address: formData.address,
      contact: {
        principalName: formData.principalName || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined
      },
      assignedEmployees: [],
      totalStudents: formData.totalStudents ? parseInt(formData.totalStudents) : undefined
    };

    onAddSchool(newSchool);
    
    toast({
      title: "School added successfully",
      description: `${formData.name} has been added to the system.`,
    });

    // Reset form
    setFormData({
      name: '',
      address: '',
      principalName: '',
      phone: '',
      email: '',
      totalStudents: ''
    });
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!externalOpen && (
        <DialogTrigger asChild>
          <Button className="animate-fade-in">
            <Plus className="mr-2 h-4 w-4" />
            Add School
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle>Add New School</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">School Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter school name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter school address"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="principalName">Principal Name</Label>
            <Input
              id="principalName"
              value={formData.principalName}
              onChange={(e) => handleInputChange('principalName', e.target.value)}
              placeholder="Enter principal's name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="admin@school.edu"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalStudents">Total Students</Label>
            <Input
              id="totalStudents"
              type="number"
              value={formData.totalStudents}
              onChange={(e) => handleInputChange('totalStudents', e.target.value)}
              placeholder="1200"
              min="0"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add School
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSchoolModal;