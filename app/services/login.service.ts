import { supabase } from "../lib/supabase";

type LoginCredentials = {
  username: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
};

export const loginService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (!credentials.username || !credentials.password) {
      return {
        success: false,
        message: "Por favor completa todos los campos",
      };
    }

    // Supabase requiere email, así que tratamos el username como email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.username,
      password: credentials.password,
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Error al iniciar sesión",
      };
    }

    if (data.user) {
      return {
        success: true,
        message: "Inicio de sesión exitoso",
      };
    }

    return {
      success: false,
      message: "Error al iniciar sesión",
    };
  },
};

