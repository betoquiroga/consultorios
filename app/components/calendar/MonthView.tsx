"use client";

import { useMemo } from "react";
import { Calendar, Clock } from "lucide-react";
import type { AppointmentWithPatient } from "../../interfaces/appointment.interface";
import {
  getDaysInMonth,
  isSameDay,
  isToday,
  formatTime,
} from "../../utils/calendar.utils";

type MonthViewProps = {
  currentDate: Date;
  appointments: AppointmentWithPatient[];
};

export function MonthView({ currentDate, appointments }: MonthViewProps) {
  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.start_time);
      return isSameDay(aptDate, date);
    });
  };

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 gap-px bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-gray-900 p-2 text-center text-sm font-medium text-gray-400"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isTodayDate = isToday(day);

          return (
            <div
              key={index}
              className={`min-h-24 p-1 bg-gray-900 border border-gray-800 ${
                !isCurrentMonth ? "opacity-40" : ""
              }`}
            >
              <div
                className={`text-xs mb-1 ${
                  isTodayDate
                    ? "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-semibold"
                    : "text-gray-400"
                }`}
              >
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((apt) => {
                  const startTime = new Date(apt.start_time);
                  return (
                    <div
                      key={apt.id}
                      className="text-xs bg-blue-600/20 text-blue-300 px-1 py-0.5 rounded truncate"
                      title={`${apt.patient.name} - ${formatTime(startTime)}`}
                    >
                      <Clock className="inline w-3 h-3 mr-1" />
                      {formatTime(startTime)}
                    </div>
                  );
                })}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{dayAppointments.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

