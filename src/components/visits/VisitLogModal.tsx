import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { School, Visit, FunnelStage, FUNNEL_STAGES, NEXT_STEP_OPTIONS } from '@/types/auth';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import AddSchoolModal from '@/components/schools/AddSchoolModal';

interface VisitLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schools: School[];
  employeeId: string;
  onLogVisit: (visit: Omit<Visit, 'id' | 'createdAt'>) => void;
  onAddSchool?: (school: Omit<School, 'id' | 'createdAt'>) => void;
}

const VisitLogModal: React.FC<VisitLogModalProps> = ({
  open,
  onOpenChange,
  schools,
  employeeId,
  onLogVisit,
  onAddSchool
}) => {
  const [schoolId, setSchoolId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [comments, setComments] = useState('');
  const [funnelStage, setFunnelStage] = useState<FunnelStage>('awareness');
  const [nextStepAction, setNextStepAction] = useState('');
  const [nextStepDate, setNextStepDate] = useState<Date | undefined>(undefined);
  const [nextStepTime, setNextStepTime] = useState('');
  const [schoolSearchTerm, setSchoolSearchTerm] = useState('');
  const [showAddSchool, setShowAddSchool] = useState(false);
  const { toast } = useToast();

  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(schoolSearchTerm.toLowerCase())
  );

  const nextStepOptions = NEXT_STEP_OPTIONS[funnelStage] || [];

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setSchoolId('');
      setDate('');
      setTime('');
      setComments('');
      setFunnelStage('awareness');
      setNextStepAction('');
      setNextStepDate(undefined);
      setNextStepTime('');
      setSchoolSearchTerm('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schoolId || !comments.trim() || !nextStepAction || !nextStepDate || !nextStepTime) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields including next step scheduling.",
      });
      return;
    }

    const visitData: Omit<Visit, 'id' | 'createdAt'> = {
      schoolId,
      employeeId,
      date: date || format(new Date(), 'yyyy-MM-dd'),
      time: time || format(new Date(), 'HH:mm'),
      comments: comments.trim(),
      funnelStage,
      nextStep: {
        action: nextStepAction,
        scheduleDate: format(nextStepDate, 'yyyy-MM-dd'),
        scheduleTime: nextStepTime
      }
    };

    onLogVisit(visitData);

    toast({
      title: "Visit logged successfully",
      description: "Your school visit has been recorded.",
    });

    onOpenChange(false);
  };

  const requiresScheduling = (action: string) => {
    const schedulingActions = [
      'Schedule a follow-up call',
      'Schedule discovery call or demo',
      'Schedule proposal review meeting',
      'Send meeting invite',
      'Schedule final Q&A session',
      'Schedule onboarding session'
    ];
    return schedulingActions.some(schedulingAction => action.includes('Schedule') || action.includes('meeting'));
  };

  const handleAddSchool = (newSchool: Omit<School, 'id' | 'createdAt'>) => {
    if (onAddSchool) {
      onAddSchool(newSchool);
      // Auto-select the newly added school
      setSchoolId(`school-${Date.now()}`); // This would be the actual ID from the API
      setShowAddSchool(false);
      toast({
        title: "School added successfully",
        description: `${newSchool.name} has been added and selected.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log School Visit</DialogTitle>
          <DialogDescription>
            Record details about your school visit and track progress through the sales funnel.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="school">School *</Label>
            <Select value={schoolId} onValueChange={setSchoolId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Search schools..."
                    value={schoolSearchTerm}
                    onChange={(e) => setSchoolSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                </div>
                {filteredSchools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
                {onAddSchool && (
                  <div 
                    className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm text-primary border-t"
                    onClick={() => setShowAddSchool(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Not on the list? Add new school
                  </div>
                      Not on the list? Add new school
                    </div>
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Visit Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Select date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Visit Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Select time"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="funnelStage">Funnel Stage *</Label>
            <Select value={funnelStage} onValueChange={(value: FunnelStage) => {
              setFunnelStage(value);
              setNextStepAction(''); // Reset next step when stage changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select funnel stage" />
              </SelectTrigger>
              <SelectContent>
                {FUNNEL_STAGES.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextStep">Next Step *</Label>
            <Select value={nextStepAction} onValueChange={setNextStepAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select next step" />
              </SelectTrigger>
              <SelectContent>
                {nextStepOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {nextStepAction && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <Label className="text-sm font-medium">Schedule Next Step *</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !nextStepDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {nextStepDate ? format(nextStepDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={nextStepDate}
                        onSelect={setNextStepDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Time *</Label>
                  <Input
                    type="time"
                    value={nextStepTime}
                    onChange={(e) => setNextStepTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comments">Visit Comments *</Label>
            <Textarea
              id="comments"
              placeholder="Describe your visit, key points discussed, outcomes, etc."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Sales Funnel Visual Guide */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <h4 className="font-medium mb-3 text-sm">Sales Funnel Progress</h4>
            <div className="flex items-center gap-1">
              {FUNNEL_STAGES.map((stage, index) => (
                <div key={stage.value} className="flex items-center">
                  <div 
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      FUNNEL_STAGES.findIndex(s => s.value === funnelStage) >= index
                        ? `${stage.color.split(' ')[0]} border-transparent`
                        : 'bg-muted border-muted-foreground/20'
                    }`}
                  >
                    {FUNNEL_STAGES.findIndex(s => s.value === funnelStage) >= index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  {index < FUNNEL_STAGES.length - 1 && (
                    <div className={`w-6 h-0.5 ${
                      FUNNEL_STAGES.findIndex(s => s.value === funnelStage) > index 
                        ? 'bg-primary' 
                        : 'bg-muted-foreground/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Current: <span className="font-medium text-foreground">
                {FUNNEL_STAGES.find(s => s.value === funnelStage)?.label || 'Select a stage'}
              </span>
            </div>
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
              Log Visit
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

export default VisitLogModal;