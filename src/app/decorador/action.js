"use server";

import { redirect } from "next/navigation";

export async function loginAction(formData) {
  "use server";
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Preencha tudo" };
  }

  const res = await fetch("http://localhost:3000/api/v1/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const user = await res.json();

  if (!user.success) {
    return { error: user.message };
  }

  // 🔐 aqui é SERVER (melhor lugar)
  // você pode salvar cookie ao invés de localStorage

  redirect("/painel");
}