import { supabase } from "../lib/supabase";

type SignupCredentials = {
  email: string;
  password: string;
  name: string;
};

type SignupResponse = {
  success: boolean;
  message: string;
};

export const signupService = {
  async signup(credentials: SignupCredentials): Promise<SignupResponse> {
    if (!credentials.email || !credentials.password || !credentials.name) {
      return {
        success: false,
        message: "Por favor completa todos los campos",
      };
    }

    if (credentials.password.length < 6) {
      return {
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      };
    }

    // Crear el usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        emailRedirectTo: undefined,
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Error al registrar usuario",
      };
    }

    if (!data.user) {
      return {
        success: false,
        message: "Error al registrar usuario",
      };
    }

    // Crear el registro en la tabla doctors
    const { error: doctorError } = await supabase
      .from("doctors")
      .insert({
        id: data.user.id,
        name: credentials.name,
        // chat_id se genera automáticamente por la base de datos
      });

    if (doctorError) {
      return {
        success: false,
        message:
          doctorError.message || "Error al crear el perfil del doctor",
      };
    }

    return {
      success: true,
      message: "Usuario registrado exitosamente",
    };
  },
};

