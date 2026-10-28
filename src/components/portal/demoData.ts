export type DemoStatus = "Publicada" | "Borrador" | "Cerrada" | "Pendiente";

export const DEMO_EXAMS = [
  { name: "Simulacro Saber 11 — N.º 3", type: "Saber 11", questions: 50, status: "Publicada" as DemoStatus, assigned: "Grado 11" },
  { name: "Refuerzo — Lectura crítica", type: "Por materia", questions: 20, status: "Publicada" as DemoStatus, assigned: "Grado 10, Grado 11" },
  { name: "Simulacro Saber 11 — N.º 4", type: "Saber 11", questions: 0, status: "Borrador" as DemoStatus, assigned: "Sin asignar" },
  { name: "Simulacro Saber 11 — N.º 2", type: "Saber 11", questions: 50, status: "Cerrada" as DemoStatus, assigned: "Grado 11" },
];

export const DEMO_CONTENT = [
  { name: "Misión", section: "Nosotros", status: "Pendiente" as DemoStatus },
  { name: "Visión", section: "Nosotros", status: "Pendiente" as DemoStatus },
  { name: "Resultados históricos", section: "Resultados", status: "Pendiente" as DemoStatus },
  { name: "Programas", section: "Programas", status: "Borrador" as DemoStatus },
];

export const DEMO_COMPONENTS = [
  "Lectura crítica",
  "Matemáticas",
  "Sociales y ciudadanas",
  "Ciencias naturales",
  "Inglés",
];

export const DEMO_QUESTIONS = [
  { number: 1, component: "Lectura crítica", answer: "B", status: "✓ Correcta", kind: "success" },
  { number: 2, component: "Lectura crítica", answer: "D", status: "✕ Incorrecta", kind: "error" },
  { number: 3, component: "Matemáticas", answer: "—", status: "○ Omitida", kind: "neutral" },
];

// TODO: Conectar a la base de datos.
export const DEMO_QUESTION_NUMBERS = Array.from({ length: 18 }, (_, index) => index + 1);
