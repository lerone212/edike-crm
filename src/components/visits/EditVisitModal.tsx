import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Visit, FunnelStage, FUNNEL_STAGES, NEXT_STEP_OPTIONS } from '@/types/auth';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EditVisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visit: Visit | null;
  onUpdateVisit: (visitId: string, updates: { 
    comments: string; 
    funnelStage: FunnelStage; 
    nextStep: {
      action: string;
      scheduleDate: string;
      scheduleTime: string;
    };
  }) => void;
}

const EditVisitModal: React.FC<EditVisitModalProps> = ({
  open,
  onOpenChange,
  visit,
  onUpdateVisit
}) => {
  const [comments, setComments] = useState('');
  const [funnelStage, setFunnelStage] = useState<FunnelStage>('awareness');
  const [nextStepAction, setNextStepAction] = useState('');
  const [nextStepDate, setNextStepDate] = useState<Date | undefined>(undefined);
  const [nextStepTime, setNextStepTime] = useState('');
  const { toast } = useToast();

  const nextStepOptions = NEXT_STEP_OPTIONS[funnelStage] || [];

  useEffect(() => {
    if (visit) {
      setComments(visit.comments);
      setFunnelStage(visit.funnelStage);
      setNextStepAction(visit.nextStep?.action || '');
      setNextStepDate(visit.nextStep?.scheduleDate ? new Date(visit.nextStep.scheduleDate) : undefined);
      setNextStepTime(visit.nextStep?.scheduleTime || '');
    }
  }, [visit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!visit || !comments.trim() || !nextStepAction || !nextStepDate || !nextStepTime) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields including next step scheduling.",
      });
      return;
    }

    onUpdateVisit(visit.id, {
      comments: comments.trim(),
      funnelStage,
      nextStep: {
        action: nextStepAction,
        scheduleDate: format(nextStepDate, 'yyyy-MM-dd'),
        scheduleTime: nextStepTime
      }
    });

    toast({
      title: "Visit updated successfully",
      description: "Your school visit has been updated.",
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

  if (!visit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit School Visit</DialogTitle>
          <DialogDescription>
            Update the comments and funnel stage for this school visit.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>School</Label>
            <div className="text-sm text-muted-foreground">
              Visit on {visit.date} at {visit.time}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="funnelStage">Funnel Stage</Label>
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
            <Label htmlFor="comments">Visit Comments</Label>
            <Textarea
              id="comments"
              placeholder="Describe your visit, key points discussed, next steps, etc."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              required
            />
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
              Update Visit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVisitModal;