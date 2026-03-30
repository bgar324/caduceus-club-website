import type { APIRoute } from "astro";
import { getFormValue, redirectToCms } from "../../../lib/cms";
import { createSession, deleteSession, reorderSession, saveSession } from "../../../lib/content";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const intentValue = formData.get("_intent");
  const intent = typeof intentValue === "string" ? intentValue : "save";

  try {
    if (intent === "create") {
      await createSession({
        groupId: getFormValue(formData, "groupId"),
        letter: getFormValue(formData, "letter"),
        title: getFormValue(formData, "title"),
        description: getFormValue(formData, "description"),
        feedbackUrl: getFormValue(formData, "feedbackUrl"),
        buttonText: getFormValue(formData, "buttonText"),
      });

      return redirectToCms("session-created");
    }

    if (intent === "delete") {
      await deleteSession(getFormValue(formData, "id"));

      return redirectToCms("session-deleted");
    }

    if (intent === "reorder") {
      await reorderSession({
        id: getFormValue(formData, "id"),
        groupId: getFormValue(formData, "groupId"),
        targetPosition: Number(getFormValue(formData, "targetPosition")),
      });

      return redirectToCms("session-reordered");
    }

    await saveSession({
      id: getFormValue(formData, "id"),
      letter: getFormValue(formData, "letter"),
      title: getFormValue(formData, "title"),
      description: getFormValue(formData, "description"),
      feedbackUrl: getFormValue(formData, "feedbackUrl"),
      buttonText: getFormValue(formData, "buttonText"),
    });

    return redirectToCms("session-saved");
  } catch (error) {
    return redirectToCms(
      "save-failed",
      error instanceof Error ? error.message : "Session could not be saved.",
    );
  }
};
