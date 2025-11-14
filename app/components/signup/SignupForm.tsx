import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "../login/Input";
import { signupService } from "../../services/signup.service";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    const response = await signupService.signup({ email, password, name });

    if (response.success) {
      toast.success(response.message);
      router.push("/subscription/checkout");
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          label="Nombre Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingresa tu nombre completo"
          required
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu email"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          required
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirma tu contraseña"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Registrando..." : "Crear Cuenta"}
        </button>
      </div>
    </form>
  );
}

