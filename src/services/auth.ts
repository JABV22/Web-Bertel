import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";


//LLega pepe y le dice a su amigo, "A mi me dan miedo las matematicas"
//Su amigo le pregunta, por?
//Pepe dice, "haaaa" y se corriendo

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    if (error.name === "AuthSessionMissingError") {
      return null;
    }

    throw error;
  }

  return user;
}
