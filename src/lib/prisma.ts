import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { getConfiguredDatabaseUrl } from "./env";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
  prismaConnectionString?: string;
};

function createPrismaClient(connectionString: string) {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export function getPrismaClient() {
  const connectionString = getConfiguredDatabaseUrl();

  if (!connectionString) {
    throw new Error("DATABASE_URL or DIRECT_URL is not set.");
  }

  if (
    !globalForPrisma.prisma ||
    globalForPrisma.prismaConnectionString !== connectionString
  ) {
    globalForPrisma.prisma = createPrismaClient(connectionString);
    globalForPrisma.prismaConnectionString = connectionString;
  }

  return globalForPrisma.prisma;
}
