export type UserRole = 'super_admin' | 'it_support' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  assignedSchools?: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
  isLoading: boolean;
}

export interface School {
  id: string;
  name: string;
  address: string;
  contact: {
    phone?: string;
    email?: string;
    principalName?: string;
  };
  assignedEmployees: string[];
  totalStudents?: number;
  createdAt: string;
}

export interface Visit {
  id: string;
  schoolId: string;
  employeeId: string;
  date: string;
  time: string;
  comments: string;
  funnelStage: FunnelStage;
  nextStep: {
    action: string;
    scheduleDate: string;
    scheduleTime: string;
  };
  createdAt: string;
}

export type FunnelStage = 
  | 'awareness'
  | 'interest'
  | 'intent'
  | 'consideration'
  | 'decision_yes'
  | 'decision_no';

export const FUNNEL_STAGES: { value: FunnelStage; label: string; color: string; description: string }[] = [
  { 
    value: 'awareness', 
    label: 'Awareness', 
    color: 'bg-slate-100 text-slate-800',
    description: 'The school becomes aware of Edike through outreach.'
  },
  { 
    value: 'interest', 
    label: 'Interest', 
    color: 'bg-blue-100 text-blue-800',
    description: 'The school expresses curiosity—acknowledges, asks questions, or engages with materials.'
  },
  { 
    value: 'intent', 
    label: 'Intent', 
    color: 'bg-orange-100 text-orange-800',
    description: 'The school shows signals of intent, e.g., asks for a meeting or requests more information/proposal.'
  },
  { 
    value: 'consideration', 
    label: 'Consideration', 
    color: 'bg-green-100 text-green-800',
    description: 'The school evaluates Edike against their needs.'
  },
  { 
    value: 'decision_yes', 
    label: 'Decision - Yes', 
    color: 'bg-emerald-100 text-emerald-800',
    description: 'The school decides to move forward with a partnership.'
  },
  { 
    value: 'decision_no', 
    label: 'Decision - No', 
    color: 'bg-red-100 text-red-800',
    description: 'The school declines the partnership opportunity.'
  }
];

export const NEXT_STEP_OPTIONS: Record<FunnelStage, string[]> = {
  awareness: [
    'Send introductory email',
    'Share brochure / company deck',
    'Schedule a follow-up call',
    'Add to drip email campaign',
    'No immediate next step — monitor'
  ],
  interest: [
    'Answer questions / provide clarifications',
    'Share case studies or testimonials',
    'Send pricing / product sheet',
    'Schedule discovery call or demo',
    'Follow up in X days'
  ],
  intent: [
    'Prepare and send formal proposal',
    'Schedule proposal review meeting',
    'Send meeting invite',
    'Gather requirements',
    'Confirm decision-making timeline',
    'Follow up after proposal'
  ],
  consideration: [
    'Offer trial / pilot program',
    'Provide references / testimonials',
    'Negotiate terms',
    'Share competitive analysis',
    'Follow up to check status',
    'Schedule final Q&A session'
  ],
  decision_yes: [
    'Send contract for signature',
    'Schedule onboarding session',
    'Record outcome (Closed Won)',
    'Collect feedback',
    'Archive record and set reminder to re-engage later'
  ],
  decision_no: [
    'Record outcome (Closed Lost)',
    'Collect feedback if declined',
    'Archive record and set reminder to re-engage later'
  ]
};