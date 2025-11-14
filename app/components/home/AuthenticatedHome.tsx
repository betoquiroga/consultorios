"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { logoutService } from "../../services/logout.service";

export function AuthenticatedHome() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await logoutService.logout();
      if (result.success) {
        toast.success(result.message);
        router.push("/");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al cerrar sesión"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 space-y-6">
          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 mx-auto mb-4">
              <span className="text-2xl font-bold text-white">C</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-gray-400">
              Gestiona tu consultorio de forma eficiente
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/calendar"
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-teal-700 hover:to-cyan-700"
            >
              <Calendar className="h-5 w-5" />
              Ver Calendario
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full rounded-lg border border-gray-700 bg-gray-800/50 px-6 py-3 font-medium text-gray-300 transition-all duration-200 hover:border-red-500/50 hover:bg-gray-800 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

