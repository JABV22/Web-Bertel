export const DEMO_CREDENTIALS = {
  username: "jose",
  password: "Jose1",
} as const;

export const DEMO_SESSION_COOKIE = "bertel_demo_session";
export const DEMO_SESSION_VALUE = "authenticated";

// TODO: reemplazar por autenticación real, sesiones seguras y usuarios de la BD.
export function isValidDemoSession(value: string | undefined) {
  return value === DEMO_SESSION_VALUE;
}
