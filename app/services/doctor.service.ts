import { supabase } from "../lib/supabase";
import { Doctor } from "../interfaces/doctor.interface";

export const doctorService = {
  async getDoctors(): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from("doctors")
      .select("id, name, chat_id, created_at, updated_at")
      .order("name", { ascending: true });

    if (error) {
      throw new Error(error.message || "Error al obtener los doctores");
    }

    return (data as Doctor[]) || [];
  },
};

