"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useAppointments } from "../hooks/useAppointments";
import { useCreateAppointment } from "../hooks/useCreateAppointment";
import { CalendarViewSwitcher } from "../components/calendar/CalendarViewSwitcher";
import { CalendarNavigation } from "../components/calendar/CalendarNavigation";
import { MonthView } from "../components/calendar/MonthView";
import { WeekView } from "../components/calendar/WeekView";
import { DayView } from "../components/calendar/DayView";
import { CreateAppointmentModal } from "../components/calendar/CreateAppointmentModal";
import type { AppointmentView } from "../types/appointment.type";
import { getDateRangeForView } from "../utils/calendar.utils";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<AppointmentView>("month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createAppointment = useCreateAppointment();

  const dateRange = useMemo(
    () => getDateRangeForView(view, currentDate),
    [view, currentDate]
  );

  const { data: appointments = [], isLoading, error } = useAppointments({
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleCreateAppointment = async (data: {
    patient_id: string;
    start_time: string;
    end_time: string;
    reason: string;
  }) => {
    try {
      await createAppointment.mutateAsync({
        patient_id: data.patient_id,
        start_time: data.start_time,
        reason: data.reason,
      });
      toast.success("Cita creada exitosamente");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al crear la cita"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CalendarNavigation
            currentDate={currentDate}
            view={view}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <Plus className="h-5 w-5" />
              Nueva Cita
            </button>
            <CalendarViewSwitcher currentView={view} onViewChange={setView} />
          </div>
        </div>

        <div className="bg-gray-950 rounded-lg border border-gray-800 p-6 min-h-[600px]">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Cargando citas...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-400">
                Error al cargar las citas: {error.message}
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {view === "month" && (
                <MonthView currentDate={currentDate} appointments={appointments} />
              )}
              {view === "week" && (
                <WeekView currentDate={currentDate} appointments={appointments} />
              )}
              {view === "day" && (
                <DayView currentDate={currentDate} appointments={appointments} />
              )}
            </>
          )}
        </div>
      </div>

      <CreateAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAppointment}
        isLoading={createAppointment.isPending}
      />
    </div>
  );
}

