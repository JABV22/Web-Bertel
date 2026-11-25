"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function activateAccount(
  _previous: { message: string },
  form: FormData,
): Promise<{ message: string }> {
  const password = form.get("password");
  if (typeof password !== "string" || password.length < 12 || password.length > 72 ||
    password !== form.get("confirm")) {
    return { message: "Las contrase\u00f1as deben coincidir y tener entre 12 y 72 caracteres." };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { message: "No fue posible guardar la contrase\u00f1a. Comprueba que tu invitaci\u00f3n siga vigente." };
  await supabase.auth.signOut({ scope: "local" });
  redirect("/ingreso");
}
