"use client";

import { Calendar, Grid3x3, CalendarDays } from "lucide-react";
import type { AppointmentView } from "../../types/appointment.type";

type CalendarViewSwitcherProps = {
  currentView: AppointmentView;
  onViewChange: (view: AppointmentView) => void;
};

export function CalendarViewSwitcher({
  currentView,
  onViewChange,
}: CalendarViewSwitcherProps) {
  const views: { value: AppointmentView; label: string; icon: typeof Calendar }[] = [
    { value: "month", label: "Mes", icon: Calendar },
    { value: "week", label: "Semana", icon: Grid3x3 },
    { value: "day", label: "Día", icon: CalendarDays },
  ];

  return (
    <div className="flex gap-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = currentView === view.value;
        return (
          <button
            key={view.value}
            onClick={() => onViewChange(view.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{view.label}</span>
          </button>
        );
      })}
    </div>
  );
}

