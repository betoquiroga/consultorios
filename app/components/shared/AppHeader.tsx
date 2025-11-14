"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { logoutService } from "../../services/logout.service";

export function AppHeader() {
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500">
            <span className="text-lg font-bold text-white">C</span>
          </div>
          <span className="text-xl font-bold text-white">Consultorios</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/calendar"
            className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-teal-500/50 hover:bg-gray-800 hover:text-white"
          >
            <Calendar className="h-4 w-4" />
            Ver Calendario
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-red-500/50 hover:bg-gray-800 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </header>
  );
}

