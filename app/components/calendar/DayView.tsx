"use client";

import { useMemo } from "react";
import { Clock, User, FileText } from "lucide-react";
import type { AppointmentWithPatient } from "../../interfaces/appointment.interface";
import {
  isSameDay,
  formatTime,
  formatDate,
} from "../../utils/calendar.utils";

type DayViewProps = {
  currentDate: Date;
  appointments: AppointmentWithPatient[];
};

const hours = Array.from({ length: 24 }, (_, i) => i);

export function DayView({ currentDate, appointments }: DayViewProps) {
  const dayAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.start_time);
      return isSameDay(aptDate, currentDate);
    });
  }, [appointments, currentDate]);

  const getAppointmentsForHour = (hour: number) => {
    return dayAppointments.filter((apt) => {
      const aptDate = new Date(apt.start_time);
      return aptDate.getHours() === hour;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="mb-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
        <h2 className="text-xl font-semibold text-white">
          {formatDate(currentDate)}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          {dayAppointments.length} cita{dayAppointments.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="space-y-4">
        {hours.map((hour) => {
          const hourAppointments = getAppointmentsForHour(hour);
          if (hourAppointments.length === 0) return null;

          return (
            <div key={hour} className="bg-gray-900 rounded-lg border border-gray-800 p-4">
              <div className="text-sm font-medium text-gray-400 mb-3">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div className="space-y-3">
                {hourAppointments.map((apt) => {
                  const startTime = new Date(apt.start_time);
                  const endTime = new Date(apt.end_time);

                  return (
                    <div
                      key={apt.id}
                      className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300">
                          {formatTime(startTime)} - {formatTime(endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">
                          {apt.patient.name}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {apt.patient.phone}
                        </span>
                      </div>
                      {apt.reason && (
                        <div className="flex items-start gap-2 mt-2">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-gray-300 text-sm">{apt.reason}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {dayAppointments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay citas programadas para este día
          </div>
        )}
      </div>
    </div>
  );
}

