import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";
import { Input } from "./Input";
import { loginService } from "../../services/login.service";
import { subscriptionService } from "../../services/subscription.service";
import { isSubscriptionActive } from "../../utils/subscription.utils";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await loginService.login({ username, password });

    if (response.success) {
      toast.success(response.message);
      
      const subscriptionStatus = await subscriptionService.getSubscriptionStatus();
      
      if (
        subscriptionStatus.success &&
        subscriptionStatus.subscription &&
        isSubscriptionActive(subscriptionStatus.subscription)
      ) {
        router.push("/calendar");
      } else {
        router.push("/subscription/checkout");
      }
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          id="username"
          name="username"
          type="email"
          label="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogIn className="h-5 w-5" />
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </div>
    </form>
  );
}

