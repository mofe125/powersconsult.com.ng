import { createServerFn } from "@tanstack/react-start";

const BUCKET = "applications";

export const fetchApplications = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => input)
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("Admin password not configured");
    if (data.password !== expected) {
      throw new Error("Invalid password");
    }

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: rows, error } = await supabaseAdmin
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const fileFields = [
      "cv_path",
      "cover_letter_path",
      "portfolio_path",
      "certificates_path",
    ] as const;

    const enriched = await Promise.all(
      (rows ?? []).map(async (row) => {
        const signed: Record<string, string | null> = {};
        for (const field of fileFields) {
          const path = row[field] as string | null;
          if (path) {
            const { data: s } = await supabaseAdmin.storage
              .from(BUCKET)
              .createSignedUrl(path, 60 * 60);
            signed[field] = s?.signedUrl ?? null;
          } else {
            signed[field] = null;
          }
        }
        return { ...row, signed_urls: signed };
      }),
    );

    return { applications: enriched };
  });

export const fetchConsultations = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => input)
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("Admin password not configured");
    if (data.password !== expected) throw new Error("Invalid password");

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: rows, error } = await supabaseAdmin
      .from("consultation_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return { consultations: rows ?? [] };
  });