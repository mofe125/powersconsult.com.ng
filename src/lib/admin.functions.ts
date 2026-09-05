import { createServerFn } from "@tanstack/react-start";

const BUCKET = "applications";

function verify(input: string) {
  const expected = (process.env.ADMIN_PASSWORD ?? "").trim();
  if (!expected) throw new Error("Access code is not configured yet.");
  if (input.trim() !== expected) throw new Error("Incorrect access code.");
}

export const fetchAllData = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => input)
  .handler(async ({ data }) => {
    verify(data.password);

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const [appsRes, consRes] = await Promise.all([
      supabaseAdmin
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("consultation_requests")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (appsRes.error) throw new Error(appsRes.error.message);
    if (consRes.error) throw new Error(consRes.error.message);

    const fileFields = [
      "cv_path",
      "cover_letter_path",
      "portfolio_path",
      "certificates_path",
    ] as const;

    const applications = await Promise.all(
      (appsRes.data ?? []).map(async (row) => {
        const files: { label: string; url: string }[] = [];
        for (const field of fileFields) {
          const path = row[field] as string | null;
          if (!path) continue;
          const { data: signed } = await supabaseAdmin.storage
            .from(BUCKET)
            .createSignedUrl(path, 60 * 60);
          if (signed?.signedUrl) {
            files.push({
              label: field.replace(/_path$/, "").replace(/_/g, " "),
              url: signed.signedUrl,
            });
          }
        }
        return { ...row, files };
      }),
    );

    return { applications, consultations: consRes.data ?? [] };
  });
