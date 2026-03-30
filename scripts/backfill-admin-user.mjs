import "dotenv/config";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
const providedSeed = process.argv[2]?.trim();
const seed = providedSeed && providedSeed.length > 0 ? providedSeed : crypto.randomUUID();
const email = `${seed}@${seed}.com`;
const password = seed;

if (!supabaseUrl) {
  console.error("NEXT_PUBLIC_SUPABASE_URL is required.");
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is required.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

async function listAllUsers() {
  const users = [];
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw error;
    }

    const batch = data.users ?? [];
    users.push(...batch);

    if (batch.length < 200) {
      return users;
    }

    page += 1;
  }
}

async function upsertCentralAdmin() {
  const users = await listAllUsers();
  const existingCentralAdmin = users.find((user) => (user.email ?? "").toLowerCase() === email.toLowerCase());

  for (const user of users) {
    const currentMetadata =
      user.app_metadata && typeof user.app_metadata === "object" ? user.app_metadata : {};

    if (currentMetadata.role === "admin" && user.id !== existingCentralAdmin?.id) {
      const { error } = await supabase.auth.admin.updateUserById(user.id, {
        app_metadata: {
          ...currentMetadata,
          role: "user",
        },
      });

      if (error) {
        throw error;
      }
    }
  }

  if (existingCentralAdmin) {
    const currentMetadata =
      existingCentralAdmin.app_metadata && typeof existingCentralAdmin.app_metadata === "object"
        ? existingCentralAdmin.app_metadata
        : {};

    const { data, error } = await supabase.auth.admin.updateUserById(existingCentralAdmin.id, {
      password,
      email_confirm: true,
      app_metadata: {
        ...currentMetadata,
        role: "admin",
      },
    });

    if (error) {
      throw error;
    }

    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: {
      role: "admin",
    },
  });

  if (error || !data.user) {
    throw error ?? new Error("Failed to create the central admin user.");
  }

  return data.user;
}

const user = await upsertCentralAdmin();

console.log(
  JSON.stringify(
    {
      userId: user.id,
      email,
      password,
      role: "admin",
    },
    null,
    2,
  ),
);
