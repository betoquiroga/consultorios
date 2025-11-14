"use client";

import { Calendar, Clock, Users, Shield } from "lucide-react";
import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 h-72 w-72 animate-pulse-slow rounded-full bg-teal-500/20 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 h-96 w-96 animate-pulse-slow rounded-full bg-cyan-500/20 blur-3xl delay-1000 animate-float" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow rounded-full bg-blue-500/20 blur-3xl delay-500 animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-8 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm font-medium text-white">
            ✨ La mejor plataforma para gestionar tu consultorio
          </span>
        </div>

        <h1 className="mb-6 text-5xl font-extrabold leading-tight text-white sm:text-6xl lg:text-7xl">
          Gestiona tu consultorio
          <br />
          <span className="bg-gradient-to-r from-white via-cyan-200 to-teal-200 bg-clip-text text-transparent">
            de forma inteligente
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-200 sm:text-2xl">
          Agenda citas, gestiona pacientes y optimiza tu tiempo con la plataforma
          más completa del mercado
        </p>

        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="group relative overflow-hidden rounded-xl bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/50"
          >
            <span className="relative z-10">Comenzar Gratis</span>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
          <Link
            href="/login"
            className="rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20"
          >
            Ver Demo
          </Link>
        </div>

        {/* Features grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          <div className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
            <Calendar className="mx-auto mb-2 h-8 w-8 text-white" />
            <p className="text-sm font-medium text-white">Agenda Inteligente</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
            <Users className="mx-auto mb-2 h-8 w-8 text-white" />
            <p className="text-sm font-medium text-white">Gestión de Pacientes</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
            <Clock className="mx-auto mb-2 h-8 w-8 text-white" />
            <p className="text-sm font-medium text-white">Ahorra Tiempo</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
            <Shield className="mx-auto mb-2 h-8 w-8 text-white" />
            <p className="text-sm font-medium text-white">100% Seguro</p>
          </div>
        </div>
      </div>
    </section>
  );
}

