import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TimeSlot {
  day: string;
  times: string[];
}

interface TimeSlotSelectorProps {
  value: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
  '08:00-10:00',
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
];

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ value, onChange }) => {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const addTimeSlot = () => {
    if (!selectedDay || !selectedTime) return;

    const existingDay = value.find(slot => slot.day === selectedDay);
    
    if (existingDay) {
      if (!existingDay.times.includes(selectedTime)) {
        onChange(
          value.map(slot =>
            slot.day === selectedDay
              ? { ...slot, times: [...slot.times, selectedTime].sort() }
              : slot
          )
        );
      }
    } else {
      onChange([...value, { day: selectedDay, times: [selectedTime] }]);
    }

    setSelectedTime('');
  };

  const removeTimeSlot = (day: string, time: string) => {
    const updatedSlots = value
      .map(slot => {
        if (slot.day === day) {
          const newTimes = slot.times.filter(t => t !== time);
          return newTimes.length > 0 ? { ...slot, times: newTimes } : null;
        }
        return slot;
      })
      .filter(Boolean) as TimeSlot[];

    onChange(updatedSlots);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          <option value="">Select Day</option>
          {DAYS.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          disabled={!selectedDay}
        >
          <option value="">Select Time</option>
          {TIME_SLOTS.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>

        <Button onClick={addTimeSlot} disabled={!selectedDay || !selectedTime}>
          Add Time Slot
        </Button>
      </div>

      {value.length > 0 && (
        <Card className="p-4">
          <h4 className="text-sm font-semibold mb-3">Selected Availability:</h4>
          <div className="space-y-3">
            {value.map(slot => (
              <div key={slot.day}>
                <p className="text-sm font-medium mb-2">{slot.day}</p>
                <div className="flex flex-wrap gap-2">
                  {slot.times.map(time => (
                    <Badge key={time} variant="secondary" className="gap-1 pr-1">
                      {time}
                      <button
                        onClick={() => removeTimeSlot(slot.day, time)}
                        className="ml-1 hover:bg-destructive/10 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
