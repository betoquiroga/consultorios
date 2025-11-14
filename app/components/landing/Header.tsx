"use client";

import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

export function Header() {
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
            href="/login"
            className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-teal-500/50 hover:bg-gray-800 hover:text-white"
          >
            <LogIn className="h-4 w-4" />
            Iniciar Sesión
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-teal-700 hover:to-cyan-700"
          >
            <UserPlus className="h-4 w-4" />
            Registrarse
          </Link>
        </nav>
      </div>
    </header>
  );
}

