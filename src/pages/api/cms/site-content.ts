import type { APIRoute } from "astro";
import { createUploadedAsset } from "../../../lib/assets";
import { getFormValue, redirectToCms } from "../../../lib/cms";
import { saveSiteContent } from "../../../lib/content";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  try {
    const heroImageFile = formData.get("heroImageFile");
    let heroImageSrc = getFormValue(formData, "heroImageSrc");

    if (heroImageFile instanceof File && heroImageFile.size > 0) {
      const uploadedAsset = await createUploadedAsset(heroImageFile);
      heroImageSrc = uploadedAsset.url;
    }

    await saveSiteContent({
      heroImageSrc,
      heroImageAlt: getFormValue(formData, "heroImageAlt"),
      heroTitle: getFormValue(formData, "heroTitle"),
      heroDescription: getFormValue(formData, "heroDescription"),
      surveyTitle: getFormValue(formData, "surveyTitle"),
      surveyDescription: getFormValue(formData, "surveyDescription"),
      surveyButtonText: getFormValue(formData, "surveyButtonText"),
      surveyFeedbackUrl: getFormValue(formData, "surveyFeedbackUrl"),
    });

    return redirectToCms("site-saved");
  } catch (error) {
    return redirectToCms(
      "save-failed",
      error instanceof Error ? error.message : "Site content could not be saved.",
    );
  }
};
