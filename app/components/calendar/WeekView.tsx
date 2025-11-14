"use client";

import { useMemo } from "react";
import { Clock, User } from "lucide-react";
import type { AppointmentWithPatient } from "../../interfaces/appointment.interface";
import {
  getWeekDays,
  isSameDay,
  isToday,
  formatTime,
} from "../../utils/calendar.utils";

type WeekViewProps = {
  currentDate: Date;
  appointments: AppointmentWithPatient[];
};

const hours = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({ currentDate, appointments }: WeekViewProps) {
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.start_time);
      return isSameDay(aptDate, date);
    });
  };

  const getAppointmentsForHour = (date: Date, hour: number) => {
    const dayAppointments = getAppointmentsForDay(date);
    return dayAppointments.filter((apt) => {
      const aptDate = new Date(apt.start_time);
      return aptDate.getHours() === hour;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="grid grid-cols-8 gap-px bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-900 p-2"></div>
        {weekDays.map((day) => {
          const isTodayDate = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`bg-gray-900 p-2 text-center ${
                isTodayDate ? "bg-blue-900/30" : ""
              }`}
            >
              <div className="text-xs text-gray-400">
                {day.toLocaleDateString("es-ES", { weekday: "short" })}
              </div>
              <div
                className={`text-lg font-semibold ${
                  isTodayDate ? "text-blue-400" : "text-white"
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
        {hours.map((hour) => (
          <div key={hour} className="contents">
            <div className="bg-gray-900 p-2 text-xs text-gray-400 text-right pr-4 border-t border-gray-800">
              {hour.toString().padStart(2, "0")}:00
            </div>
            {weekDays.map((day) => {
              const hourAppointments = getAppointmentsForHour(day, hour);
              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="bg-gray-900 border-t border-gray-800 min-h-16 p-1"
                >
                  {hourAppointments.map((apt) => {
                    const startTime = new Date(apt.start_time);
                    const endTime = new Date(apt.end_time);

                    return (
                      <div
                        key={apt.id}
                        className="bg-blue-600/20 border border-blue-500/30 rounded p-1 mb-1"
                      >
                        <div className="flex items-center gap-1 text-xs text-blue-300">
                          <Clock className="w-3 h-3" />
                          {formatTime(startTime)} - {formatTime(endTime)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-white mt-1">
                          <User className="w-3 h-3" />
                          {apt.patient.name}
                        </div>
                        {apt.reason && (
                          <div className="text-xs text-gray-400 mt-1 truncate">
                            {apt.reason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

