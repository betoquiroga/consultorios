"use client";

import { useState, useEffect } from "react";
import { Clock, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export function FomoSection() {
  const [countdown, setCountdown] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-950/50 to-cyan-950/50 p-8 shadow-2xl shadow-teal-500/20 sm:p-12">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-1.5 text-sm font-semibold text-red-400">
              <Clock className="h-4 w-4 animate-pulse" />
              OFERTA LIMITADA
            </div>

            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              ⚡ No pierdas esta oportunidad única
            </h2>

            <p className="mb-8 text-lg text-gray-300 sm:text-xl">
              Únete a más de{" "}
              <span className="font-bold text-teal-400">10,000 profesionales</span>{" "}
              que ya están transformando su consultorio
            </p>

            <div className="mb-8 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Users className="h-5 w-5 text-teal-400" />
                <span className="text-sm text-gray-300">
                  <span className="font-bold text-white">+500</span> nuevos usuarios esta semana
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                <span className="text-sm text-gray-300">
                  <span className="font-bold text-white">98%</span> de satisfacción
                </span>
              </div>
            </div>

            <div className="mb-8 rounded-xl border border-teal-500/50 bg-black/30 p-6 backdrop-blur-sm">
              <p className="mb-3 text-sm font-medium text-gray-400">
                La oferta termina en:
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-white sm:text-4xl">
                    {String(countdown.hours).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-400">Horas</div>
                </div>
                <div className="text-2xl font-bold text-teal-400">:</div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-white sm:text-4xl">
                    {String(countdown.minutes).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-400">Minutos</div>
                </div>
                <div className="text-2xl font-bold text-teal-400">:</div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-white sm:text-4xl">
                    {String(countdown.seconds).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-400">Segundos</div>
                </div>
              </div>
            </div>

            <Link
              href="/signup"
              className="inline-block rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-teal-500/50 transition-all duration-300 hover:scale-105 hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-teal-500/70"
            >
              🚀 Crear cuenta GRATIS ahora
            </Link>

            <p className="mt-4 text-sm text-gray-400">
              Sin tarjeta de crédito • Cancela cuando quieras • Soporte 24/7
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

