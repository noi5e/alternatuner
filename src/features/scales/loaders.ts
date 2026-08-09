import { getScaleById } from "@/features/scales/api";
import { routeSlugTranslator } from "@/lib/routeSlug";

import type { LoaderFunctionArgs } from "react-router";

export async function scaleLoader({ params }: LoaderFunctionArgs) {
  const { scaleSlug } = params;

  if (!scaleSlug) {
    throw new Response("Missing scale identifier", { status: 400 });
  }

  let scaleId: string;

  try {
    scaleId = routeSlugTranslator.toUUID(scaleSlug);
  } catch {
    throw new Response("Invalid scale identifier", { status: 400 });
  }

  const scale = await getScaleById(scaleId);

  return { scale };
}
