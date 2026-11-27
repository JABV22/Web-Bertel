import "server-only";
import { requireRole } from "@/services/auth";

type Asset = { id: string; asset_url: string; alt_text: string };
type Detail = {
  id: string;
  title: string;
  sections: { id: string; title: string }[];
  questions: {
    id: string;
    statement: string;
    question_order: number;
    section_id: string;
    correct_option_id: string | null;
    options: { id: string; option_text: string; position: number }[];
    assets: Asset[];
  }[];
};

function storagePath(asset: Asset) {
  if (!URL.canParse(asset.asset_url) || !process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const url = new URL(asset.asset_url);
  if (url.origin !== new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin) return null;
  const match = url.pathname.match(/^\/storage\/v1\/object\/(?:public|authenticated)\/SIMULACROS\/(.+)$/);
  if (!match) return null;
  try {
    const path = decodeURIComponent(match[1]);
    return /^SIMULACRO [345]\//.test(path) ? path : null;
  } catch {
    return null;
  }
}

export async function getControlledAssessmentReview(id: string, requestedPage: number) {
  const { supabase } = await requireRole(["admin"]);
  const { data, error } = await supabase.rpc("bertel_admin_detalle_simulacro", { p_assessment_id: id });
  if (error || !data) throw new Error("No fue posible cargar la sesión del simulacro.");

  const detail = data as Detail;
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(detail.questions.length / pageSize));
  const page = Math.min(Math.max(1, requestedPage), pageCount);
  const rows = detail.questions.slice((page - 1) * pageSize, page * pageSize);
  const paths = Array.from(new Set(rows.flatMap((row) => row.assets.map(storagePath)).filter((path) => path !== null)));
  const { data: signed } = paths.length
    ? await supabase.storage.from("SIMULACROS").createSignedUrls(paths, 300)
    : { data: [] };
  const urls = new Map(signed?.map((item) => [item.path, item.signedUrl]));
  const sections = new Map(detail.sections.map((section) => [section.id, section.title]));

  return {
    id: detail.id,
    title: detail.title,
    page,
    pageCount,
    questions: rows.map((row) => ({
      id: row.id,
      order: row.question_order,
      section: sections.get(row.section_id),
      statement: row.statement,
      options: row.options,
      correctOptionId: row.correct_option_id,
      assets: row.assets
        .toSorted((left, right) => Number(!left.asset_url.includes("/lecturas_")) - Number(!right.asset_url.includes("/lecturas_")))
        .map((asset) => ({ ...asset, asset_url: urls.get(storagePath(asset) ?? "") ?? "" })),
    })),
  };
}
