import { NextResponse } from "next/server";
import {
  DEMO_CREDENTIALS,
  DEMO_SESSION_COOKIE,
  DEMO_SESSION_VALUE,
} from "@/lib/demoAuth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (
    body.username !== DEMO_CREDENTIALS.username ||
    body.password !== DEMO_CREDENTIALS.password
  ) {
    return NextResponse.json(
      { message: "El usuario o la contraseña no son correctos." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ redirectTo: "/panel" });
  response.cookies.set(DEMO_SESSION_COOKIE, DEMO_SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
