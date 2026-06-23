import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { fetchApplications } from "@/lib/admin.functions";
import {
  listCompanies,
  upsertCompany,
  deleteCompany,
  upsertPosition,
  deletePosition,
  listMatches,
  runMatching,
} from "@/lib/matching.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Loader2,
  LogOut,
  Download,
  Plus,
  Trash2,
  Pencil,
  Sparkles,
  Building2,
  Briefcase,
  Users,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin · Powers Consult" }] }),
});

type Application = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  state: string | null;
  city: string | null;
  linkedin_url: string | null;
  employment_status: string | null;
  current_job_title: string | null;
  years_of_experience: string | null;
  highest_qualification: string | null;
  industry: string | null;
  expected_salary: string | null;
  skills: string | null;
  certifications: string | null;
  preferred_work_types: string[] | null;
  career_interests: string[] | null;
  signed_urls: {
    cv_path: string | null;
    cover_letter_path: string | null;
    portfolio_path: string | null;
    certificates_path: string | null;
  };
};

type Position = {
  id: string;
  company_id: string;
  title: string;
  work_type: string | null;
  location: string | null;
  required_skills: string | null;
  description: string | null;
  min_years: string | null;
  salary: string | null;
  status: string;
};

type Company = {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  website: string | null;
  description: string | null;
  positions: Position[];
};

type MatchRow = {
  id: string;
  score: number;
  reason: string | null;
  created_at: string;
  position: { id: string; title: string; company: { id: string; name: string } | null } | null;
  application: {
    id: string;
    full_name: string;
    email: string;
    current_job_title: string | null;
    years_of_experience: string | null;
    skills: string | null;
  } | null;
};

function AdminPage() {
  const fetchApps = useServerFn(fetchApplications);
  const fetchCompanies = useServerFn(listCompanies);
  const fetchMatches = useServerFn(listMatches);
  const runMatch = useServerFn(runMatching);

  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [apps, setApps] = useState<Application[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [matching, setMatching] = useState(false);

  async function refreshAll(pwd: string) {
    const [a, c, m] = await Promise.all([
      fetchApps({ data: { password: pwd } }),
      fetchCompanies({ data: { password: pwd } }),
      fetchMatches({ data: { password: pwd } }),
    ]);
    setApps(a.applications as unknown as Application[]);
    setCompanies(c.companies as unknown as Company[]);
    setMatches(m.matches as unknown as MatchRow[]);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await refreshAll(password);
      setAuthed(true);
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRunMatching() {
    setMatching(true);
    try {
      const res = await runMatch({ data: { password } });
      toast.success(
        `Matched ${res.matched} candidate-role pairs across ${res.positions} positions`,
      );
      const m = await fetchMatches({ data: { password } });
      setMatches(m.matches as unknown as MatchRow[]);
    } catch (err: any) {
      toast.error(err?.message || "Matching failed");
    } finally {
      setMatching(false);
    }
  }

  async function refreshCompanies() {
    const c = await fetchCompanies({ data: { password } });
    setCompanies(c.companies as unknown as Company[]);
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const openPositionsCount = companies.reduce(
    (n, c) => n + c.positions.filter((p) => p.status === "open").length,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <h1 className="text-2xl font-semibold">Powers Consult · Admin</h1>
            <p className="text-sm text-muted-foreground">
              Talent matching dashboard
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setAuthed(false)}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat icon={<Users className="h-4 w-4" />} label="Candidates" value={apps.length} />
          <Stat icon={<Building2 className="h-4 w-4" />} label="Companies" value={companies.length} />
          <Stat icon={<Briefcase className="h-4 w-4" />} label="Open positions" value={openPositionsCount} />
          <Stat icon={<Target className="h-4 w-4" />} label="AI matches" value={matches.length} />
        </div>

        <Tabs defaultValue="matches" className="space-y-4">
          <TabsList>
            <TabsTrigger value="matches">AI Matches</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="companies">Companies & Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="matches">
            <MatchesTab
              matches={matches}
              onRun={handleRunMatching}
              running={matching}
              hasData={openPositionsCount > 0 && apps.length > 0}
            />
          </TabsContent>

          <TabsContent value="candidates">
            <CandidatesTab apps={apps} />
          </TabsContent>

          <TabsContent value="companies">
            <CompaniesTab
              companies={companies}
              password={password}
              onRefresh={refreshCompanies}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-4">
        <div className="rounded-md bg-muted p-2 text-muted-foreground">{icon}</div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// ───────────────── Matches Tab ─────────────────
function MatchesTab({
  matches,
  onRun,
  running,
  hasData,
}: {
  matches: MatchRow[];
  onRun: () => void;
  running: boolean;
  hasData: boolean;
}) {
  // Group by position
  const byPosition = new Map<string, { title: string; company: string; rows: MatchRow[] }>();
  for (const m of matches) {
    if (!m.position) continue;
    const key = m.position.id;
    const entry = byPosition.get(key) ?? {
      title: m.position.title,
      company: m.position.company?.name ?? "—",
      rows: [],
    };
    entry.rows.push(m);
    byPosition.set(key, entry);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">AI matching agent</div>
              <p className="text-sm text-muted-foreground">
                Scores every candidate against every open role and ranks the best fits with a match percentage.
              </p>
            </div>
          </div>
          <Button onClick={onRun} disabled={running || !hasData}>
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Matching…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Run AI matching
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {!hasData && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Add at least one company with an open position, and make sure you have candidate applications, then click <b>Run AI matching</b>.
          </CardContent>
        </Card>
      )}

      {byPosition.size === 0 && hasData && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No matches yet. Run the AI matcher to generate ranked candidates per role.
          </CardContent>
        </Card>
      )}

      {[...byPosition.entries()].map(([posId, group]) => (
        <Card key={posId}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {group.title}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  · {group.company}
                </span>
              </CardTitle>
              <Badge variant="secondary">{group.rows.length} candidate(s)</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y">
              {group.rows
                .sort((a, b) => b.score - a.score)
                .map((m) => (
                  <div key={m.id} className="grid grid-cols-1 gap-3 py-3 md:grid-cols-[1fr_240px]">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="truncate font-medium">{m.application?.full_name}</div>
                        <Badge variant="outline" className="text-xs">
                          {m.application?.current_job_title || "—"}
                        </Badge>
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {m.application?.email} · {m.application?.years_of_experience || "—"} yrs
                      </div>
                      {m.reason && (
                        <p className="mt-1 text-sm text-muted-foreground">{m.reason}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={m.score} className="h-2" />
                      <div
                        className={`w-12 text-right text-sm font-semibold ${scoreColor(m.score)}`}
                      >
                        {m.score}%
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-600";
  if (s >= 60) return "text-amber-600";
  return "text-muted-foreground";
}

// ───────────────── Candidates Tab ─────────────────
function CandidatesTab({ apps }: { apps: Application[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  if (apps.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No applications yet.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      {apps.map((app) => {
        const isOpen = expanded === app.id;
        return (
          <Card key={app.id}>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : app.id)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-muted/40"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{app.full_name}</div>
                <div className="truncate text-sm text-muted-foreground">
                  {app.email}
                  {app.current_job_title ? ` · ${app.current_job_title}` : ""}
                </div>
              </div>
              <div className="shrink-0 text-right text-xs text-muted-foreground">
                {new Date(app.created_at).toLocaleString()}
              </div>
            </button>
            {isOpen && (
              <CardContent className="border-t pt-4">
                <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm md:grid-cols-2">
                  <Field label="Phone" value={app.phone} />
                  <Field label="Date of birth" value={app.date_of_birth} />
                  <Field label="Gender" value={app.gender} />
                  <Field
                    label="Location"
                    value={[app.city, app.state].filter(Boolean).join(", ") || null}
                  />
                  <Field label="LinkedIn" value={app.linkedin_url} link />
                  <Field label="Employment status" value={app.employment_status} />
                  <Field label="Current job title" value={app.current_job_title} />
                  <Field label="Years of experience" value={app.years_of_experience} />
                  <Field label="Highest qualification" value={app.highest_qualification} />
                  <Field label="Industry" value={app.industry} />
                  <Field label="Expected salary" value={app.expected_salary} />
                  <Field
                    label="Preferred work types"
                    value={app.preferred_work_types?.join(", ") || null}
                  />
                  <Field
                    label="Career interests"
                    value={app.career_interests?.join(", ") || null}
                  />
                  <Field label="Skills" value={app.skills} />
                  <Field label="Certifications" value={app.certifications} />
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <DocLink label="CV" url={app.signed_urls.cv_path} />
                  <DocLink label="Cover letter" url={app.signed_urls.cover_letter_path} />
                  <DocLink label="Portfolio" url={app.signed_urls.portfolio_path} />
                  <DocLink label="Certificates" url={app.signed_urls.certificates_path} />
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ───────────────── Companies Tab ─────────────────
function CompaniesTab({
  companies,
  password,
  onRefresh,
}: {
  companies: Company[];
  password: string;
  onRefresh: () => void | Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CompanyDialog password={password} onSaved={onRefresh} />
      </div>
      {companies.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No companies yet. Add a tech company to start posting roles.
          </CardContent>
        </Card>
      )}
      {companies.map((c) => (
        <Card key={c.id}>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{c.name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {[c.industry, c.location].filter(Boolean).join(" · ") || "—"}
                </p>
                {c.description && (
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    {c.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <CompanyDialog password={password} onSaved={onRefresh} company={c} />
                <DeleteButton
                  password={password}
                  id={c.id}
                  kind="company"
                  onDone={onRefresh}
                />
                <PositionDialog
                  password={password}
                  companyId={c.id}
                  onSaved={onRefresh}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {c.positions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No positions yet.</p>
            ) : (
              <div className="space-y-2">
                {c.positions.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {[p.work_type, p.location, p.min_years && `${p.min_years} yrs`, p.salary]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={p.status === "open" ? "default" : "secondary"}>
                        {p.status}
                      </Badge>
                      <PositionDialog
                        password={password}
                        companyId={c.id}
                        onSaved={onRefresh}
                        position={p}
                      />
                      <DeleteButton
                        password={password}
                        id={p.id}
                        kind="position"
                        onDone={onRefresh}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CompanyDialog({
  password,
  company,
  onSaved,
}: {
  password: string;
  company?: Company;
  onSaved: () => void | Promise<void>;
}) {
  const save = useServerFn(upsertCompany);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: company?.name ?? "",
    industry: company?.industry ?? "",
    location: company?.location ?? "",
    website: company?.website ?? "",
    description: company?.description ?? "",
  });
  useEffect(() => {
    if (open) {
      setForm({
        name: company?.name ?? "",
        industry: company?.industry ?? "",
        location: company?.location ?? "",
        website: company?.website ?? "",
        description: company?.description ?? "",
      });
    }
  }, [open, company]);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    try {
      await save({ data: { password, id: company?.id, ...form } });
      toast.success("Saved");
      setOpen(false);
      await onSaved();
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {company ? (
          <Button size="sm" variant="outline">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="h-4 w-4" /> Add company
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{company ? "Edit company" : "Add company"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <LabeledInput label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <LabeledInput label="Industry" value={form.industry} onChange={(v) => setForm({ ...form, industry: v })} />
          <LabeledInput label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <LabeledInput label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Description
            </label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={saving || !form.name.trim()}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PositionDialog({
  password,
  companyId,
  position,
  onSaved,
}: {
  password: string;
  companyId: string;
  position?: Position;
  onSaved: () => void | Promise<void>;
}) {
  const save = useServerFn(upsertPosition);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: position?.title ?? "",
    work_type: position?.work_type ?? "",
    location: position?.location ?? "",
    required_skills: position?.required_skills ?? "",
    description: position?.description ?? "",
    min_years: position?.min_years ?? "",
    salary: position?.salary ?? "",
    status: position?.status ?? "open",
  });
  useEffect(() => {
    if (open) {
      setForm({
        title: position?.title ?? "",
        work_type: position?.work_type ?? "",
        location: position?.location ?? "",
        required_skills: position?.required_skills ?? "",
        description: position?.description ?? "",
        min_years: position?.min_years ?? "",
        salary: position?.salary ?? "",
        status: position?.status ?? "open",
      });
    }
  }, [open, position]);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    try {
      await save({
        data: { password, id: position?.id, company_id: companyId, ...form },
      });
      toast.success("Saved");
      setOpen(false);
      await onSaved();
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {position ? (
          <Button size="sm" variant="outline">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4" /> Add role
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{position ? "Edit role" : "Add role"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <LabeledInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Work type" value={form.work_type} onChange={(v) => setForm({ ...form, work_type: v })} placeholder="Remote / Hybrid / Onsite" />
            <LabeledInput label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
            <LabeledInput label="Min years" value={form.min_years} onChange={(v) => setForm({ ...form, min_years: v })} />
            <LabeledInput label="Salary" value={form.salary} onChange={(v) => setForm({ ...form, salary: v })} />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Required skills
            </label>
            <Textarea
              value={form.required_skills}
              onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
              rows={2}
              placeholder="e.g. React, TypeScript, Node.js, AWS"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Description
            </label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Status
            </label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={saving || !form.title.trim()}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteButton({
  password,
  id,
  kind,
  onDone,
}: {
  password: string;
  id: string;
  kind: "company" | "position";
  onDone: () => void | Promise<void>;
}) {
  const delCompany = useServerFn(deleteCompany);
  const delPosition = useServerFn(deletePosition);
  const [busy, setBusy] = useState(false);
  async function go() {
    if (!confirm(`Delete this ${kind}?`)) return;
    setBusy(true);
    try {
      if (kind === "company") await delCompany({ data: { password, id } });
      else await delPosition({ data: { password, id } });
      await onDone();
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Button size="sm" variant="ghost" onClick={go} disabled={busy}>
      <Trash2 className="h-3.5 w-3.5 text-destructive" />
    </Button>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function Field({ label, value, link }: { label: string; value: string | null; link?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words">
        {value ? (
          link ? (
            <a href={value} target="_blank" rel="noreferrer" className="text-primary underline">
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </dd>
    </div>
  );
}

function DocLink({ label, url }: { label: string; url: string | null }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
    >
      <Download className="h-3.5 w-3.5" /> {label}
    </a>
  );
}