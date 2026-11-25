import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const destination = new URL("/activar-cuenta", url.origin);

  if (tokenHash && url.searchParams.get("type") === "invite") {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "invite" });
    if (!error) return NextResponse.redirect(destination);
  }

  destination.searchParams.set("error", "invitacion");
  return NextResponse.redirect(destination);
}
