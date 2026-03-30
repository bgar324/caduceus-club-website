import type { APIRoute } from "astro";
import { getFormValue, redirectToCms } from "../../../lib/cms";
import {
  createSessionGroup,
  deleteSessionGroup,
  reorderSessionGroup,
  saveSessionGroup,
} from "../../../lib/content";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const intentValue = formData.get("_intent");
  const intent = typeof intentValue === "string" ? intentValue : "save";

  try {
    if (intent === "create") {
      await createSessionGroup({
        title: getFormValue(formData, "title"),
        time: getFormValue(formData, "time"),
        sectionType: getFormValue(formData, "sectionType") as "workshop" | "focus",
      });

      return redirectToCms("group-created");
    }

    if (intent === "delete") {
      await deleteSessionGroup(getFormValue(formData, "id"));

      return redirectToCms("group-deleted");
    }

    if (intent === "reorder") {
      await reorderSessionGroup({
        id: getFormValue(formData, "id"),
        targetPosition: Number(getFormValue(formData, "targetPosition")),
      });

      return redirectToCms("group-reordered");
    }

    await saveSessionGroup({
      id: getFormValue(formData, "id"),
      title: getFormValue(formData, "title"),
      time: getFormValue(formData, "time"),
      sectionType: getFormValue(formData, "sectionType") as "workshop" | "focus",
    });

    return redirectToCms("group-saved");
  } catch (error) {
    return redirectToCms(
      "save-failed",
      error instanceof Error ? error.message : "Session group could not be saved.",
    );
  }
};
