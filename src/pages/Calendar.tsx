import React from 'react';
import CalendarModule from '@/components/calendar/CalendarModule';
import { useAuth } from '@/contexts/AuthContext';

const Calendar = () => {
  const { user } = useAuth();
  const isAdminView = user?.role === 'super_admin';

  return (
    <div className="container mx-auto">
      <CalendarModule isAdminView={isAdminView} />
    </div>
  );
};

export default Calendar;