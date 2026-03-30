// NÃO tem "use client"

import { Header } from "@/components/Header/Header";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full h-16 flex items-center justify-center">
        <Header disable />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <LoginForm />
      </main>
    </div>
  );
}
