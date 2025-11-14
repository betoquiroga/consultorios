import { supabase } from "../lib/supabase";

type LogoutResponse = {
  success: boolean;
  message: string;
};

export const logoutService = {
  async logout(): Promise<LogoutResponse> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message || "Error al cerrar sesión",
      };
    }

    return {
      success: true,
      message: "Sesión cerrada exitosamente",
    };
  },
};

