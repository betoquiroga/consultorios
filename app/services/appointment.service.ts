import { supabase } from "../lib/supabase";
import type { AppointmentWithPatient, GetAppointmentsParams } from "../interfaces/appointment.interface";

export type CreateAppointmentParams = {
  patient_id: string;
  start_time: string;
  reason: string;
};

export type CheckAvailabilityParams = {
  doctor_id: string;
  start_time: string;
};

export const appointmentService = {
  async getAppointments(
    params: GetAppointmentsParams
  ): Promise<AppointmentWithPatient[]> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No hay sesión activa");
    }

    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        id,
        start_time,
        end_time,
        reason,
        patient:patients (
          id,
          name,
          phone
        )
      `
      )
      .eq("doctor_id", session.user.id)
      .gte("start_time", params.startDate.toISOString())
      .lte("start_time", params.endDate.toISOString())
      .order("start_time", { ascending: true });

    if (error) {
      throw new Error(error.message || "Error al obtener las citas");
    }

    return (data as unknown as AppointmentWithPatient[]) || [];
  },

  async checkAvailability(
    params: CheckAvailabilityParams
  ): Promise<{ available: boolean; message: string }> {
    const startTime = new Date(params.start_time);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

    const { data, error } = await supabase
      .from("appointments")
      .select("id")
      .eq("doctor_id", params.doctor_id)
      .lt("start_time", endTime.toISOString())
      .gt("end_time", startTime.toISOString())
      .is("deleted_at", null)
      .limit(1);

    if (error) {
      throw new Error(error.message || "Error al verificar disponibilidad");
    }

    const available = !data || data.length === 0;

    return {
      available,
      message: available
        ? "El doctor está disponible en ese horario"
        : "El doctor no está disponible en ese horario, ya tiene una cita programada",
    };
  },

  async createAppointment(params: CreateAppointmentParams): Promise<void> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No hay sesión activa");
    }

    const startTime = new Date(params.start_time);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

    const { error } = await supabase.from("appointments").insert({
      doctor_id: session.user.id,
      patient_id: params.patient_id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      reason: params.reason || null,
    });

    if (error) {
      throw new Error(error.message || "Error al crear la cita");
    }
  },
};

