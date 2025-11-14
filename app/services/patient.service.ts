import { supabase } from "../lib/supabase";

export type Patient = {
  id: string;
  name: string;
  phone: string;
};

export const patientService = {
  async searchPatients(searchTerm: string): Promise<Patient[]> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No hay sesión activa");
    }

    const { data, error } = await supabase
      .from("patients")
      .select("id, name, phone")
      .or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .limit(10)
      .order("name", { ascending: true });

    if (error) {
      throw new Error(error.message || "Error al buscar pacientes");
    }

    return (data as Patient[]) || [];
  },
};

