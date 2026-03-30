import "dotenv/config";
import { spawnSync } from "node:child_process";

const databaseUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";
const hasConfiguredDatabaseUrl =
  databaseUrl.length > 0 && !databaseUrl.includes("[YOUR-PASSWORD]");

if (!hasConfiguredDatabaseUrl) {
  console.log(
    "[db] Skipping prisma migrate deploy because DATABASE_URL is missing or still uses the placeholder password.",
  );
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
