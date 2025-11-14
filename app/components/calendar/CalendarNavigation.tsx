"use client";

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import type { AppointmentView } from "../../types/appointment.type";

type CalendarNavigationProps = {
  currentDate: Date;
  view: AppointmentView;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export function CalendarNavigation({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
}: CalendarNavigationProps) {
  const getDateLabel = () => {
    switch (view) {
      case "month":
        return currentDate.toLocaleDateString("es-ES", {
          month: "long",
          year: "numeric",
        });
      case "week": {
        const day = currentDate.getDay();
        const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(currentDate);
        monday.setDate(diff);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return `${monday.getDate()} - ${sunday.getDate()} ${sunday.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}`;
      }
      case "day":
        return currentDate.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToday}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors"
        >
          <CalendarIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Hoy</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <h1 className="text-xl font-semibold text-white capitalize">
          {getDateLabel()}
        </h1>
      </div>
    </div>
  );
}

