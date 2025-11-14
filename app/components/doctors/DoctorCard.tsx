import Link from "next/link";
import { Calendar } from "lucide-react";
import { Doctor } from "../../interfaces/doctor.interface";

type DoctorCardProps = {
  doctor: Doctor;
};

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-2xl font-semibold text-white">
          {doctor.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {doctor.name}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Doctor</p>
        </div>
      </div>
      <Link
        href={`/doctors/${doctor.id}/chat`}
        className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
      >
        <Calendar className="h-4 w-4" />
        Agendar cita
      </Link>
    </div>
  );
}

