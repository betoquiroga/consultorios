import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { validateSubscriptionForDoctor } from "@/app/utils/subscription-api.utils";

export async function POST(request: Request) {
  try {
    const { doctor_id, patient_name, patient_phone, start_time, reason } =
      await request.json();

    if (!doctor_id || !patient_name || !patient_phone || !start_time) {
      return NextResponse.json(
        {
          error:
            "doctor_id, patient_name, patient_phone y start_time son requeridos",
        },
        { status: 400 }
      );
    }

    const subscriptionCheck = await validateSubscriptionForDoctor(doctor_id);
    if (!subscriptionCheck.valid) {
      return NextResponse.json(
        {
          error: "No tienes una suscripción activa",
        },
        { status: 403 }
      );
    }

    const startTime = new Date(start_time);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

    let patientId: string;

    const { data: existingPatient, error: searchError } = await supabase
      .from("patients")
      .select("id")
      .eq("phone", patient_phone)
      .is("deleted_at", null)
      .single();

    if (searchError && searchError.code !== "PGRST116") {
      console.error("🔴 [create-appointment] Error al buscar paciente:", searchError);
      throw new Error(searchError.message || "Error al buscar paciente");
    }

    if (existingPatient) {
      patientId = existingPatient.id;

      const { error: updateError } = await supabase
        .from("patients")
        .update({ name: patient_name, updated_at: new Date().toISOString() })
        .eq("id", patientId);

      if (updateError) {
        console.error("🔴 [create-appointment] Error al actualizar paciente:", updateError);
      }
    } else {
      const { data: newPatient, error: createError } = await supabase
        .from("patients")
        .insert({
          name: patient_name,
          phone: patient_phone,
        })
        .select("id")
        .single();

      if (createError) {
        console.error("🔴 [create-appointment] Error al crear paciente:", createError);
        throw new Error(createError.message || "Error al crear paciente");
      }

      patientId = newPatient.id;
    }

    const { error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        doctor_id,
        patient_id: patientId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        reason: reason || null,
      });

    if (appointmentError) {
      console.error("🔴 [create-appointment] Error al crear cita:", appointmentError);
      throw new Error(
        appointmentError.message || "Error al crear la cita"
      );
    }

    const response = {
      success: true,
      message: "Cita creada exitosamente",
      appointment: {
        doctor_id,
        patient_id: patientId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        reason: reason || null,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error al crear la cita:", error);
    return NextResponse.json(
      {
        error: "Error al crear la cita",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

