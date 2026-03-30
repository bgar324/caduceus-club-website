import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import { defaultSiteContent, sessionGroups } from "../src/data/sessions.ts";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";

if (!connectionString || connectionString.includes("[YOUR-PASSWORD]")) {
  throw new Error("DIRECT_URL or DATABASE_URL must be configured with a real database password.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const sessionIds = [];
  const groupIds = [];

  await prisma.siteContent.upsert({
    where: { id: defaultSiteContent.id },
    update: {
      heroImageSrc: defaultSiteContent.hero.imageSrc,
      heroImageAlt: defaultSiteContent.hero.imageAlt,
      heroTitle: defaultSiteContent.hero.title,
      heroDescription: defaultSiteContent.hero.description,
      surveyTitle: defaultSiteContent.survey.title,
      surveyDescription: defaultSiteContent.survey.description,
      surveyButtonText: defaultSiteContent.survey.buttonText,
      surveyFeedbackUrl: defaultSiteContent.survey.feedbackUrl,
    },
    create: {
      id: defaultSiteContent.id,
      heroImageSrc: defaultSiteContent.hero.imageSrc,
      heroImageAlt: defaultSiteContent.hero.imageAlt,
      heroTitle: defaultSiteContent.hero.title,
      heroDescription: defaultSiteContent.hero.description,
      surveyTitle: defaultSiteContent.survey.title,
      surveyDescription: defaultSiteContent.survey.description,
      surveyButtonText: defaultSiteContent.survey.buttonText,
      surveyFeedbackUrl: defaultSiteContent.survey.feedbackUrl,
    },
  });

  for (const [groupIndex, group] of sessionGroups.entries()) {
    groupIds.push(group.id);

    await prisma.sessionGroup.upsert({
      where: { id: group.id },
      update: {
        sectionId: group.sectionId,
        title: group.title,
        time: group.time,
        sessionListClass: group.sessionListClass,
        displayOrder: groupIndex,
      },
      create: {
        id: group.id,
        sectionId: group.sectionId,
        title: group.title,
        time: group.time,
        sessionListClass: group.sessionListClass,
        displayOrder: groupIndex,
      },
    });

    for (const [sessionIndex, session] of group.sessions.entries()) {
      sessionIds.push(session.id);

      await prisma.session.upsert({
        where: { id: session.id },
        update: {
          groupId: group.id,
          displayOrder: sessionIndex,
          letter: session.letter,
          title: session.title,
          description: session.description,
          feedbackUrl: session.feedbackUrl,
          buttonText: session.buttonText ?? null,
        },
        create: {
          id: session.id,
          groupId: group.id,
          displayOrder: sessionIndex,
          letter: session.letter,
          title: session.title,
          description: session.description,
          feedbackUrl: session.feedbackUrl,
          buttonText: session.buttonText ?? null,
        },
      });
    }
  }

  const [siteCount, groupCount, sessionCount] = await prisma.$transaction([
    prisma.siteContent.count(),
    prisma.sessionGroup.count(),
    prisma.session.count(),
  ]);

  console.log(
    JSON.stringify(
      {
        siteCount,
        groupCount,
        sessionCount,
        backfilledGroupIds: groupIds.length,
        backfilledSessionIds: sessionIds.length,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
