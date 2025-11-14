"use client";

import { SignupHeader } from "../components/signup/SignupHeader";
import { SignupForm } from "../components/signup/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-950 via-gray-950 to-black px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-800 bg-gray-900/90 p-10 shadow-xl">
        <SignupHeader />
        <SignupForm />
      </div>
    </div>
  );
}

