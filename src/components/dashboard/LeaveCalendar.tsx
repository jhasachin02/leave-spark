import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface LeaveRequest {
  id: string;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_requested: number;
}

interface LeaveCalendarProps {
  leaveRequests: LeaveRequest[];
}

export const LeaveCalendar = ({ leaveRequests }: LeaveCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getLeaveForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return leaveRequests.filter(leave => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      const checkDate = new Date(dateStr);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const getLeaveTypeColor = (leaveType: string) => {
    switch (leaveType) {
      case 'annual_leave':
        return 'bg-primary/20 text-primary';
      case 'sick_leave':
        return 'bg-destructive/20 text-destructive';
      case 'personal_leave':
        return 'bg-warning/20 text-warning';
      case 'maternity_leave':
        return 'bg-accent/20 text-accent';
      case 'paternity_leave':
        return 'bg-secondary/20 text-secondary-foreground';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const leavesForDay = getLeaveForDate(day);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      
      days.push(
        <div
          key={day}
          className={`p-2 min-h-[80px] border rounded-lg ${
            isToday ? 'bg-primary/10 border-primary' : 'bg-card border-border'
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
            {day}
          </div>
          <div className="space-y-1">
            {leavesForDay.slice(0, 2).map((leave, index) => (
              <div
                key={`${leave.id}-${index}`}
                className={`text-xs px-1 py-0.5 rounded truncate ${getLeaveTypeColor(leave.leave_type)}`}
                title={`${leave.employee_name} - ${leave.leave_type.replace('_', ' ')}`}
              >
                {leave.employee_name}
              </div>
            ))}
            {leavesForDay.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{leavesForDay.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Leave Calendar
            </CardTitle>
            <CardDescription>
              Visual overview of approved leave requests
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[120px] text-center font-medium">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge className="bg-primary/20 text-primary">Annual Leave</Badge>
          <Badge className="bg-destructive/20 text-destructive">Sick Leave</Badge>
          <Badge className="bg-warning/20 text-warning">Personal Leave</Badge>
          <Badge className="bg-accent/20 text-accent">Maternity Leave</Badge>
          <Badge className="bg-secondary/20 text-secondary-foreground">Paternity Leave</Badge>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays()}
        </div>

        {/* Statistics */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {leaveRequests.length}
              </div>
              <div className="text-sm text-muted-foreground">Approved Leaves</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {leaveRequests.reduce((sum, leave) => sum + leave.days_requested, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {new Set(leaveRequests.map(leave => leave.employee_name)).size}
              </div>
              <div className="text-sm text-muted-foreground">Employees on Leave</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};