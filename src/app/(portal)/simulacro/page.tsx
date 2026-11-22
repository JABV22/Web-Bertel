import { AssessmentList } from "@/components/portal/AssessmentList";
import { getAvailableAssessments } from "@/services/assessments";

export const metadata = {
  title: "Simulacro Saber 11",
};

export default async function SimulacroPage() {
  const assessments = await getAvailableAssessments();
  return <AssessmentList assessments={assessments} />;
}
