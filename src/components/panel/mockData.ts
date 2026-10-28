export type TestStatus = "available" | "in-progress" | "completed" | "unavailable";

export type PanelSummary = {
  label: string;
  value: string;
};

export type TestCardData = {
  id: string;
  status: TestStatus;
  statusLabel: string;
  title: string;
  meta: string;
  description?: string;
  progress?: number;
  progressLabel?: string;
  actionLabel: string;
  actionHref: string;
  attemptsLabel?: string;
  actionVariant?: "primary" | "secondary";
};

// TODO: conexión a la BD y datos reales.
export const PANEL_STUDENT = {
  greeting: "Hola, estudiante",
  grade: "Grado 11",
  initials: "ES",
};

// TODO: conexión a la BD y datos reales.
export const PANEL_SUMMARY: PanelSummary[] = [
  { value: "—", label: "Pruebas disponibles" },
  { value: "—", label: "Simulacros realizados" },
  { value: "—", label: "Promedio propio" },
  { value: "—", label: "Último resultado" },
];

// TODO: conexión a la BD y datos reales.
export const PANEL_TESTS: TestCardData[] = [
  {
    id: "saber-11-3",
    status: "available",
    statusLabel: "Disponible",
    title: "Simulacro Saber 11 — N.º 3",
    meta: "50 preguntas · Tiempo por confirmar",
    description: "Prueba completa con los cinco componentes evaluados.",
    actionLabel: "Iniciar",
    actionHref: "/simulacro",
    attemptsLabel: "Intentos: por confirmar",
  },
  {
    id: "lectura-critica",
    status: "in-progress",
    statusLabel: "En curso",
    title: "Refuerzo — Lectura crítica",
    meta: "20 preguntas · Reanudable",
    progress: 45,
    progressLabel: "9 de 20 respondidas",
    actionLabel: "Continuar",
    actionHref: "/simulacro",
  },
  {
    id: "saber-11-2",
    status: "completed",
    statusLabel: "Finalizada",
    title: "Simulacro Saber 11 — N.º 2",
    meta: "50 preguntas · Revisión disponible",
    description: "Resultado y explicaciones liberados.",
    actionLabel: "Ver resultado",
    actionHref: "/resultados",
    actionVariant: "secondary",
  },
  {
    id: "saber-11-4",
    status: "unavailable",
    statusLabel: "No disponible",
    title: "Simulacro Saber 11 — N.º 4",
    meta: "Se habilita según la programación del curso",
    actionLabel: "Iniciar",
    actionHref: "#",
  },
];

export const PANEL_NOTICE =
  "Las cifras aparecen vacías a propósito: la fórmula de calificación y las reglas de disponibilidad se definen en el PRD, que todavía no está disponible.";
