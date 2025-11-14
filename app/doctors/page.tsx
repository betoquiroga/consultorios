"use client";

import { DoctorCard } from "../components/doctors/DoctorCard";
import { AppHeader } from "../components/shared/AppHeader";
import { useDoctors } from "../hooks/useDoctors";

export default function DoctorsPage() {
  const { data: doctors = [], isLoading, error } = useDoctors();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <AppHeader />
      <div className="pt-24 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Doctores Disponibles
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Selecciona un doctor para agendar una cita
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-12 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              Cargando doctores...
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-12 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400">
              Error al cargar los doctores:{" "}
              {error instanceof Error ? error.message : "Error desconocido"}
            </p>
          </div>
        )}

        {!isLoading && !error && doctors.length === 0 && (
          <div className="flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-12 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              No hay doctores disponibles en este momento
            </p>
          </div>
        )}

        {!isLoading && !error && doctors.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

