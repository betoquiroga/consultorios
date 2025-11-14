import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: Request) {
  try {
    const { doctor_id, start_time } = await request.json();

    if (!doctor_id || !start_time) {
      return NextResponse.json(
        { error: "doctor_id y start_time son requeridos" },
        { status: 400 }
      );
    }

    const startTime = new Date(start_time);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

    const { data, error } = await supabase
      .from("appointments")
      .select("id")
      .eq("doctor_id", doctor_id)
      .lt("start_time", endTime.toISOString())
      .gt("end_time", startTime.toISOString())
      .is("deleted_at", null)
      .limit(1);

    if (error) {
      throw new Error(error.message || "Error al verificar disponibilidad");
    }

    const available = !data || data.length === 0;

    return NextResponse.json({
      available,
      message: available
        ? "El doctor está disponible en ese horario"
        : "El doctor no está disponible en ese horario, ya tiene una cita programada",
    });
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error);
    return NextResponse.json(
      {
        error: "Error al verificar disponibilidad",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

