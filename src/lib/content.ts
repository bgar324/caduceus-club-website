import {
  defaultHomepageContent,
  defaultSiteContent,
  getSessionGroupCategory,
  sessionGroups as defaultSessionGroups,
  type HomepageContent,
  type Session,
  type SessionGroup,
  type SessionGroupCategory,
  type SiteContent,
} from "../data/sessions";
import { hasConfiguredDatabaseUrl } from "./env";
import { getPrismaClient } from "./prisma";

type ContentSource = "database" | "defaults";

interface HomepageContentResult {
  content: HomepageContent;
  source: ContentSource;
  warning?: string;
}

interface PersistedSiteContentInput {
  heroImageSrc: string;
  heroImageAlt: string;
  heroTitle: string;
  heroDescription: string;
  surveyTitle: string;
  surveyDescription: string;
  surveyButtonText: string;
  surveyFeedbackUrl: string;
}

interface PersistedSessionGroupInput {
  id: string;
  title: string;
  time: string;
  sectionType: SessionGroupCategory;
}

interface CreateSessionGroupInput {
  title: string;
  time: string;
  sectionType: SessionGroupCategory;
}

interface PersistedSessionInput {
  id: string;
  letter: string;
  title: string;
  description: string;
  feedbackUrl: string;
  buttonText: string;
}

interface CreateSessionInput {
  groupId: string;
  letter: string;
  title: string;
  description: string;
  feedbackUrl: string;
  buttonText: string;
}

interface ReorderSessionGroupInput {
  id: string;
  targetPosition: number;
}

interface ReorderSessionInput {
  id: string;
  groupId: string;
  targetPosition: number;
}

interface RestoredSessionGroup extends SessionGroup {
  sessions: Session[];
}

function trimValue(value: string) {
  return value.trim();
}

function normalizeSessionButtonText(value: string) {
  const trimmedValue = trimValue(value);

  return trimmedValue || null;
}

function normalizeSectionType(value: string): SessionGroupCategory {
  return trimValue(value).toLowerCase().includes("focus") ? "focus" : "workshop";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requireStringField(record: Record<string, unknown>, fieldName: string) {
  const value = record[fieldName];

  if (typeof value !== "string") {
    throw new Error(`Invalid snapshot field: ${fieldName}`);
  }

  return trimValue(value);
}

function normalizeSessionFromSnapshot(value: unknown): Session {
  if (!isRecord(value)) {
    throw new Error("Invalid session snapshot.");
  }

  const buttonText = value.buttonText;

  if (buttonText !== undefined && buttonText !== null && typeof buttonText !== "string") {
    throw new Error("Invalid snapshot field: buttonText");
  }

  return {
    id: requireStringField(value, "id"),
    letter: requireStringField(value, "letter"),
    title: requireStringField(value, "title"),
    description: requireStringField(value, "description"),
    feedbackUrl: requireStringField(value, "feedbackUrl"),
    buttonText: typeof buttonText === "string" ? trimValue(buttonText) || undefined : undefined,
  };
}

function normalizeGroupFromSnapshot(value: unknown): RestoredSessionGroup {
  if (!isRecord(value)) {
    throw new Error("Invalid session group snapshot.");
  }

  const sessionsValue = value.sessions;

  if (!Array.isArray(sessionsValue)) {
    throw new Error("Invalid snapshot field: sessions");
  }

  return {
    id: requireStringField(value, "id"),
    sectionId: requireStringField(value, "sectionId"),
    title: requireStringField(value, "title"),
    time: requireStringField(value, "time"),
    sessionListClass: requireStringField(value, "sessionListClass"),
    sessions: sessionsValue.map(normalizeSessionFromSnapshot),
  };
}

function normalizeHomepageSnapshot(snapshot: unknown): HomepageContent {
  if (!isRecord(snapshot)) {
    throw new Error("Invalid homepage snapshot.");
  }

  const siteValue = snapshot.site;
  const groupsValue = snapshot.sessionGroups;

  if (!isRecord(siteValue)) {
    throw new Error("Invalid snapshot field: site");
  }

  if (!Array.isArray(groupsValue)) {
    throw new Error("Invalid snapshot field: sessionGroups");
  }

  const heroValue = siteValue.hero;
  const surveyValue = siteValue.survey;

  if (!isRecord(heroValue) || !isRecord(surveyValue)) {
    throw new Error("Invalid snapshot site payload.");
  }

  return {
    site: {
      id: requireStringField(siteValue, "id") || defaultSiteContent.id,
      hero: {
        imageSrc: requireStringField(heroValue, "imageSrc"),
        imageAlt: requireStringField(heroValue, "imageAlt"),
        title: requireStringField(heroValue, "title"),
        description: requireStringField(heroValue, "description"),
      },
      survey: {
        title: requireStringField(surveyValue, "title"),
        description: requireStringField(surveyValue, "description"),
        buttonText: requireStringField(surveyValue, "buttonText"),
        feedbackUrl: requireStringField(surveyValue, "feedbackUrl"),
      },
    },
    sessionGroups: groupsValue.map(normalizeGroupFromSnapshot),
  };
}

function slugify(value: string, fallback: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function generateGroupId(title: string) {
  return `${slugify(title, "session-group")}-${crypto.randomUUID().slice(0, 8)}`;
}

function generateSessionId(groupId: string, title: string) {
  return `${groupId}-${slugify(title, "session")}-${crypto.randomUUID().slice(0, 8)}`;
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);

  if (movedItem === undefined) {
    throw new Error("The requested item could not be moved.");
  }

  nextItems.splice(toIndex, 0, movedItem);

  return nextItems;
}

function getTargetIndex(targetPosition: number, totalItems: number) {
  if (!Number.isInteger(targetPosition)) {
    throw new Error("Invalid target position.");
  }

  if (totalItems < 1) {
    throw new Error("Nothing is available to reorder.");
  }

  return Math.min(Math.max(targetPosition, 1), totalItems) - 1;
}

async function persistSessionGroupOrder(prisma: Awaited<ReturnType<typeof requireDatabase>>, orderedIds: string[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.sessionGroup.update({
        where: { id },
        data: { displayOrder: index + 1000 },
      }),
    ),
  );

  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.sessionGroup.update({
        where: { id },
        data: { displayOrder: index },
      }),
    ),
  );
}

async function persistSessionOrder(
  prisma: Awaited<ReturnType<typeof requireDatabase>>,
  groupId: string,
  orderedIds: string[],
) {
  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.session.update({
        where: { id },
        data: {
          groupId,
          displayOrder: index + 1000,
        },
      }),
    ),
  );

  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.session.update({
        where: { id },
        data: {
          groupId,
          displayOrder: index,
        },
      }),
    ),
  );
}

function mapDatabaseContent(site: any, groups: Array<any>): HomepageContent {
  if (!site) {
    return defaultHomepageContent;
  }

  return {
    site: {
      id: site.id,
      hero: {
        imageSrc: site.heroImageSrc,
        imageAlt: site.heroImageAlt,
        title: site.heroTitle,
        description: site.heroDescription,
      },
      survey: {
        title: site.surveyTitle,
        description: site.surveyDescription,
        buttonText: site.surveyButtonText,
        feedbackUrl: site.surveyFeedbackUrl,
      },
    },
    sessionGroups: groups.map((group) => ({
      id: group.id,
      sectionId: group.sectionId,
      title: group.title,
      time: group.time,
      sessionListClass: group.sessionListClass,
      sessions: group.sessions.map((session: any) => ({
        id: session.id,
        letter: session.letter,
        title: session.title,
        description: session.description,
        feedbackUrl: session.feedbackUrl,
        buttonText: session.buttonText ?? undefined,
      })),
    })),
  };
}

async function seedDatabaseIfEmpty(prisma = getPrismaClient()) {
  const [siteCount, groupCount] = await prisma.$transaction([
    prisma.siteContent.count(),
    prisma.sessionGroup.count(),
  ]);

  if (siteCount === 0) {
    await prisma.siteContent.create({
      data: {
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
  }

  if (groupCount === 0) {
    await prisma.$transaction([
      prisma.sessionGroup.createMany({
        data: defaultSessionGroups.map((group, displayOrder) => ({
          id: group.id,
          sectionId: group.sectionId,
          title: group.title,
          time: group.time,
          sessionListClass: group.sessionListClass,
          displayOrder,
        })),
      }),
      prisma.session.createMany({
        data: defaultSessionGroups.flatMap((group) =>
          group.sessions.map((session, displayOrder) => ({
            id: session.id,
            groupId: group.id,
            displayOrder,
            letter: session.letter,
            title: session.title,
            description: session.description,
            feedbackUrl: session.feedbackUrl,
            buttonText: session.buttonText ?? null,
          })),
        ),
      }),
    ]);
  }
}

async function repairSessionGroupCategories(prisma = getPrismaClient()) {
  const sessionGroups = await prisma.sessionGroup.findMany({
    select: {
      id: true,
      sectionId: true,
      title: true,
    },
  });
  const updates = sessionGroups
    .filter((group) => group.sectionId !== "workshop" && group.sectionId !== "focus")
    .map((group) =>
      prisma.sessionGroup.update({
        where: { id: group.id },
        data: {
          sectionId: getSessionGroupCategory(group),
        },
      }),
    );

  if (updates.length > 0) {
    await prisma.$transaction(updates);
  }
}

async function requireDatabase() {
  if (!hasConfiguredDatabaseUrl()) {
    throw new Error(
      "DATABASE_URL or DIRECT_URL is not configured with a real Supabase connection string.",
    );
  }

  const prisma = getPrismaClient();
  await seedDatabaseIfEmpty(prisma);
  await repairSessionGroupCategories(prisma);

  return prisma;
}

export async function getHomepageContent(): Promise<HomepageContentResult> {
  if (!hasConfiguredDatabaseUrl()) {
    return {
      content: defaultHomepageContent,
      source: "defaults",
      warning:
        "DATABASE_URL or DIRECT_URL is not configured with a real Supabase connection string.",
    };
  }

  try {
    const prisma = getPrismaClient();
    await seedDatabaseIfEmpty(prisma);
    await repairSessionGroupCategories(prisma);

    const [site, groups] = await prisma.$transaction([
      prisma.siteContent.findUnique({
        where: { id: defaultSiteContent.id },
      }),
      prisma.sessionGroup.findMany({
        orderBy: { displayOrder: "asc" },
        include: {
          sessions: {
            orderBy: { displayOrder: "asc" },
          },
        },
      }),
    ]);

    if (!site || groups.length === 0) {
      return {
        content: defaultHomepageContent,
        source: "defaults",
        warning: "Database returned no content. The homepage is currently using the defaults from sessions.ts.",
      };
    }

    return {
      content: mapDatabaseContent(site, groups),
      source: "database",
    };
  } catch (error) {
    return {
      content: defaultHomepageContent,
      source: "defaults",
      warning:
        error instanceof Error
          ? error.message
          : "The database could not be reached. The homepage is currently using fallback content.",
    };
  }
}

export async function saveSiteContent(input: PersistedSiteContentInput) {
  const prisma = await requireDatabase();

  return prisma.siteContent.upsert({
    where: { id: defaultSiteContent.id },
    update: {
      heroImageSrc: trimValue(input.heroImageSrc),
      heroImageAlt: trimValue(input.heroImageAlt),
      heroTitle: trimValue(input.heroTitle),
      heroDescription: trimValue(input.heroDescription),
      surveyTitle: trimValue(input.surveyTitle),
      surveyDescription: trimValue(input.surveyDescription),
      surveyButtonText: trimValue(input.surveyButtonText),
      surveyFeedbackUrl: trimValue(input.surveyFeedbackUrl),
    },
    create: {
      id: defaultSiteContent.id,
      heroImageSrc: trimValue(input.heroImageSrc),
      heroImageAlt: trimValue(input.heroImageAlt),
      heroTitle: trimValue(input.heroTitle),
      heroDescription: trimValue(input.heroDescription),
      surveyTitle: trimValue(input.surveyTitle),
      surveyDescription: trimValue(input.surveyDescription),
      surveyButtonText: trimValue(input.surveyButtonText),
      surveyFeedbackUrl: trimValue(input.surveyFeedbackUrl),
    },
  });
}

export async function saveSessionGroup(input: PersistedSessionGroupInput) {
  const prisma = await requireDatabase();
  const existingGroup = await prisma.sessionGroup.findUnique({
    where: { id: input.id },
  });

  if (!existingGroup) {
    throw new Error(`Unknown session group id: ${input.id}`);
  }

  return prisma.sessionGroup.update({
    where: { id: input.id },
    data: {
      title: trimValue(input.title),
      time: trimValue(input.time),
      sectionId: normalizeSectionType(input.sectionType),
    },
  });
}

export async function createSessionGroup(input: CreateSessionGroupInput) {
  const prisma = await requireDatabase();
  const nextDisplayOrderResult = await prisma.sessionGroup.aggregate({
    _max: { displayOrder: true },
  });

  const title = trimValue(input.title);

  return prisma.sessionGroup.create({
    data: {
      id: generateGroupId(title),
      sectionId: normalizeSectionType(input.sectionType),
      title,
      time: trimValue(input.time),
      sessionListClass: "pt-2 pb-4",
      displayOrder: (nextDisplayOrderResult._max.displayOrder ?? -1) + 1,
    },
  });
}

export async function deleteSessionGroup(id: string) {
  const prisma = await requireDatabase();

  return prisma.sessionGroup.delete({
    where: { id: trimValue(id) },
  });
}

export async function saveSession(input: PersistedSessionInput) {
  const prisma = await requireDatabase();
  const existingSession = await prisma.session.findUnique({
    where: { id: input.id },
  });

  if (!existingSession) {
    throw new Error(`Unknown session id: ${input.id}`);
  }

  return prisma.session.update({
    where: { id: input.id },
    data: {
      letter: trimValue(input.letter),
      title: trimValue(input.title),
      description: trimValue(input.description),
      feedbackUrl: trimValue(input.feedbackUrl),
      buttonText: normalizeSessionButtonText(input.buttonText),
    },
  });
}

export async function createSession(input: CreateSessionInput) {
  const prisma = await requireDatabase();
  const groupId = trimValue(input.groupId);
  const group = await prisma.sessionGroup.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    throw new Error(`Unknown session group id: ${input.groupId}`);
  }

  const nextDisplayOrderResult = await prisma.session.aggregate({
    where: { groupId },
    _max: { displayOrder: true },
  });

  const title = trimValue(input.title);

  return prisma.session.create({
    data: {
      id: generateSessionId(groupId, title),
      groupId,
      displayOrder: (nextDisplayOrderResult._max.displayOrder ?? -1) + 1,
      letter: trimValue(input.letter),
      title,
      description: trimValue(input.description),
      feedbackUrl: trimValue(input.feedbackUrl),
      buttonText: normalizeSessionButtonText(input.buttonText),
    },
  });
}

export async function deleteSession(id: string) {
  const prisma = await requireDatabase();

  return prisma.session.delete({
    where: { id: trimValue(id) },
  });
}

export async function reorderSessionGroup(input: ReorderSessionGroupInput) {
  const prisma = await requireDatabase();
  const sessionGroups = await prisma.sessionGroup.findMany({
    orderBy: { displayOrder: "asc" },
  });
  const targetGroupId = trimValue(input.id);
  const targetGroup = sessionGroups.find((group) => group.id === targetGroupId);

  if (!targetGroup) {
    throw new Error(`Unknown session group id: ${input.id}`);
  }

  const workshopGroupIds = sessionGroups
    .filter((group) => getSessionGroupCategory(group) === "workshop")
    .map((group) => group.id);
  const focusGroupIds = sessionGroups
    .filter((group) => getSessionGroupCategory(group) === "focus")
    .map((group) => group.id);
  const targetCategory = getSessionGroupCategory(targetGroup);
  const targetCategoryIds = targetCategory === "workshop" ? workshopGroupIds : focusGroupIds;
  const currentIndex = targetCategoryIds.findIndex((id) => id === targetGroupId);

  if (currentIndex < 0) {
    throw new Error("The requested session group could not be reordered.");
  }

  const reorderedCategoryIds = moveItem(
    targetCategoryIds,
    currentIndex,
    getTargetIndex(input.targetPosition, targetCategoryIds.length),
  );
  const orderedIds =
    targetCategory === "workshop"
      ? [...reorderedCategoryIds, ...focusGroupIds]
      : [...workshopGroupIds, ...reorderedCategoryIds];

  await persistSessionGroupOrder(prisma, orderedIds);
}

export async function reorderSession(input: ReorderSessionInput) {
  const prisma = await requireDatabase();
  const groupId = trimValue(input.groupId);
  const sessions = await prisma.session.findMany({
    where: { groupId },
    orderBy: { displayOrder: "asc" },
  });
  const targetSessionId = trimValue(input.id);
  const currentIndex = sessions.findIndex((session) => session.id === targetSessionId);

  if (currentIndex < 0) {
    throw new Error(`Unknown session id: ${input.id}`);
  }

  const orderedIds = moveItem(
    sessions.map((session) => session.id),
    currentIndex,
    getTargetIndex(input.targetPosition, sessions.length),
  );

  await persistSessionOrder(prisma, groupId, orderedIds);
}

export async function restoreHomepageContent(snapshot: unknown) {
  const prisma = await requireDatabase();
  const normalizedSnapshot = normalizeHomepageSnapshot(snapshot);
  const normalizedGroups = normalizedSnapshot.sessionGroups.map((group, displayOrder) => ({
    ...group,
    displayOrder,
  }));
  const normalizedSessions = normalizedGroups.flatMap((group) =>
    group.sessions.map((session, displayOrder) => ({
      ...session,
      groupId: group.id,
      displayOrder,
    })),
  );

  return prisma.$transaction(async (tx) => {
    await tx.siteContent.upsert({
      where: { id: defaultSiteContent.id },
      update: {
        heroImageSrc: normalizedSnapshot.site.hero.imageSrc,
        heroImageAlt: normalizedSnapshot.site.hero.imageAlt,
        heroTitle: normalizedSnapshot.site.hero.title,
        heroDescription: normalizedSnapshot.site.hero.description,
        surveyTitle: normalizedSnapshot.site.survey.title,
        surveyDescription: normalizedSnapshot.site.survey.description,
        surveyButtonText: normalizedSnapshot.site.survey.buttonText,
        surveyFeedbackUrl: normalizedSnapshot.site.survey.feedbackUrl,
      },
      create: {
        id: defaultSiteContent.id,
        heroImageSrc: normalizedSnapshot.site.hero.imageSrc,
        heroImageAlt: normalizedSnapshot.site.hero.imageAlt,
        heroTitle: normalizedSnapshot.site.hero.title,
        heroDescription: normalizedSnapshot.site.hero.description,
        surveyTitle: normalizedSnapshot.site.survey.title,
        surveyDescription: normalizedSnapshot.site.survey.description,
        surveyButtonText: normalizedSnapshot.site.survey.buttonText,
        surveyFeedbackUrl: normalizedSnapshot.site.survey.feedbackUrl,
      },
    });

    await tx.session.deleteMany();
    await tx.sessionGroup.deleteMany();

    if (normalizedGroups.length > 0) {
      await tx.sessionGroup.createMany({
        data: normalizedGroups.map((group) => ({
          id: group.id,
          sectionId: group.sectionId,
          title: group.title,
          time: group.time,
          sessionListClass: group.sessionListClass,
          displayOrder: group.displayOrder,
        })),
      });
    }

    if (normalizedSessions.length > 0) {
      await tx.session.createMany({
        data: normalizedSessions.map((session) => ({
          id: session.id,
          groupId: session.groupId,
          displayOrder: session.displayOrder,
          letter: session.letter,
          title: session.title,
          description: session.description,
          feedbackUrl: session.feedbackUrl,
          buttonText: session.buttonText ?? null,
        })),
      });
    }
  });
}

export function getCmsStatusMessage(status: string | null) {
  switch (status) {
    case "admin-invite-sent":
      return "Admin invite email sent.";
    case "group-reordered":
      return "Session group order updated.";
    case "history-redone":
      return "Forward action applied.";
    case "history-undone":
      return "Undo action applied.";
    case "site-saved":
      return "Homepage content updated.";
    case "group-created":
      return "Session group created.";
    case "group-deleted":
      return "Session group deleted.";
    case "group-saved":
      return "Session group updated.";
    case "session-created":
      return "Session created.";
    case "session-deleted":
      return "Session deleted.";
    case "session-reordered":
      return "Session order updated.";
    case "session-saved":
      return "Session updated.";
    case "password-set":
      return "Password updated.";
    default:
      return null;
  }
}

export function getDefaultSessionGroups() {
  return defaultSessionGroups;
}

export function getDefaultSiteContent() {
  return defaultSiteContent;
}

export type { ContentSource, HomepageContentResult, Session, SessionGroup, SiteContent };
