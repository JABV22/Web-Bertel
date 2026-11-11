import { notFound, redirect } from "next/navigation";
import { ExamRunner } from "@/components/portal/ExamRunner";
import { getAttempt } from "@/services/assessments";

export default async function AttemptPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const attempt = await getAttempt(attemptId);
  if (!attempt) notFound();
  if (attempt.status !== "en_progreso") redirect(`/resultados/${attemptId}`);

  return (
    <ExamRunner
      attemptId={attempt.id}
      title={attempt.title}
      expiresAt={attempt.expiresAt}
      questions={attempt.questions}
    />
  );
}
