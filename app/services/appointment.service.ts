import { supabase } from "../lib/supabase";
import type { AppointmentWithPatient, GetAppointmentsParams } from "../interfaces/appointment.interface";

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
};

