"use client";

import { LoginHeader } from "../components/login/LoginHeader";
import { LoginForm } from "../components/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
}

