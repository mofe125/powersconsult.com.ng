import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function assertPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("Admin password not configured");
  if (password !== expected) throw new Error("Invalid password");
}

async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// ───── Companies ─────
export const listCompanies = createServerFn({ method: "POST" })
  .inputValidator((i: { password: string }) => i)
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const sb = await getAdmin();
    const { data: companies, error } = await sb
      .from("companies")
      .select("*, positions(*)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { companies: companies ?? [] };
  });

const CompanyInput = z.object({
  password: z.string(),
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  industry: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const upsertCompany = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => CompanyInput.parse(i))
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const sb = await getAdmin();
    const { password: _p, id, ...fields } = data;
    if (id) {
      const { error } = await sb.from("companies").update(fields).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: row, error } = await sb
      .from("companies")
      .insert(fields)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteCompany = createServerFn({ method: "POST" })
  .inputValidator((i: { password: string; id: string }) => i)
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const sb = await getAdmin();
    const { error } = await sb.from("companies").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───── Positions ─────
const PositionInput = z.object({
  password: z.string(),
  id: z.string().uuid().optional(),
  company_id: z.string().uuid(),
  title: z.string().min(1),
  work_type: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  required_skills: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  min_years: z.string().optional().nullable(),
  salary: z.string().optional().nullable(),
  status: z.string().optional(),
});

export const upsertPosition = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => PositionInput.parse(i))
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const sb = await getAdmin();
    const { password: _p, id, ...fields } = data;
    if (id) {
      const { error } = await sb.from("positions").update(fields).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: row, error } = await sb
      .from("positions")
      .insert(fields)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deletePosition = createServerFn({ method: "POST" })
  .inputValidator((i: { password: string; id: string }) => i)
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const sb = await getAdmin();
    const { error } = await sb.from("positions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───── AI Matching ─────
export const listMatches = createServerFn({ method: "POST" })
  .inputValidator((i: { password: string }) => i)
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const sb = await getAdmin();
    const { data: matches, error } = await sb
      .from("ai_matches")
      .select(
        "id, score, reason, created_at, position:positions(id, title, company:companies(id, name)), application:applications(id, full_name, email, current_job_title, years_of_experience, skills)",
      )
      .order("score", { ascending: false });
    if (error) throw new Error(error.message);
    return { matches: matches ?? [] };
  });

function summarizeApplication(a: any) {
  return {
    id: a.id,
    name: a.full_name,
    title: a.current_job_title,
    years: a.years_of_experience,
    qualification: a.highest_qualification,
    industry: a.industry,
    skills: a.skills,
    interests: (a.career_interests ?? []).join(", "),
    work_types: (a.preferred_work_types ?? []).join(", "),
    location: [a.city, a.state].filter(Boolean).join(", "),
    expected_salary: a.expected_salary,
    certifications: a.certifications,
  };
}

export const runMatching = createServerFn({ method: "POST" })
  .inputValidator((i: { password: string }) => i)
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const sb = await getAdmin();
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const [{ data: positions, error: pErr }, { data: apps, error: aErr }] =
      await Promise.all([
        sb.from("positions").select("*, company:companies(name, industry, location)").eq("status", "open"),
        sb.from("applications").select("*"),
      ]);
    if (pErr) throw new Error(pErr.message);
    if (aErr) throw new Error(aErr.message);
    if (!positions?.length) throw new Error("Add at least one open position first");
    if (!apps?.length) throw new Error("No candidate applications yet");

    const candidates = apps.map(summarizeApplication);
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const { generateText, Output } = await import("ai");
    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");

    const matchSchema = z.object({
      matches: z
        .array(
          z.object({
            application_id: z.string(),
            score: z.number().min(0).max(100),
            reason: z.string(),
          }),
        )
        .max(10),
    });

    const allRows: { position_id: string; application_id: string; score: number; reason: string }[] = [];

    // Sequential to stay under rate limits
    for (const pos of positions) {
      const prompt = `You are a recruitment matching agent. Score each candidate (0-100) for how well they fit this role. Consider skills, experience years, industry, qualification, interests, and location. Be honest — low fit should score low.

ROLE:
Title: ${pos.title}
Company: ${(pos as any).company?.name ?? ""} (${(pos as any).company?.industry ?? ""})
Location: ${pos.location ?? "—"} | Work type: ${pos.work_type ?? "—"} | Min years: ${pos.min_years ?? "—"} | Salary: ${pos.salary ?? "—"}
Required skills: ${pos.required_skills ?? "—"}
Description: ${pos.description ?? "—"}

CANDIDATES (JSON):
${JSON.stringify(candidates)}

Return ONLY the top ${Math.min(10, candidates.length)} candidates as matches with application_id, score (0-100), and a one-sentence reason.`;

      try {
        const { experimental_output: out } = await generateText({
          model,
          prompt,
          experimental_output: Output.object({ schema: matchSchema }),
        });
        for (const m of out.matches) {
          if (!candidates.find((c) => c.id === m.application_id)) continue;
          allRows.push({
            position_id: pos.id,
            application_id: m.application_id,
            score: Math.round(m.score),
            reason: m.reason.slice(0, 500),
          });
        }
      } catch (err) {
        console.error("Match failed for position", pos.id, err);
      }
    }

    if (allRows.length) {
      // Clear & replace matches for the scored positions
      const positionIds = Array.from(new Set(allRows.map((r) => r.position_id)));
      await sb.from("ai_matches").delete().in("position_id", positionIds);
      const { error: insErr } = await sb.from("ai_matches").insert(allRows);
      if (insErr) throw new Error(insErr.message);
    }

    return { matched: allRows.length, positions: positions.length, candidates: candidates.length };
  });