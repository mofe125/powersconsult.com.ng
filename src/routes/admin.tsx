import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { fetchApplications } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, LogOut, Download } from "lucide-react";

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

function AdminPage() {
  const fetchFn = useServerFn(fetchApplications);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<Application[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchFn({ data: { password } });
      setApps(res.applications as Application[]);
      toast.success(`Loaded ${res.applications.length} application(s)`);
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
      setApps(null);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setApps(null);
    setPassword("");
    setExpanded(null);
  }

  if (!apps) {
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
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Applications</h1>
            <p className="text-sm text-muted-foreground">
              {apps.length} total submission(s)
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>

        {apps.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No applications yet.
            </CardContent>
          </Card>
        ) : (
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
                        <Field label="Location" value={[app.city, app.state].filter(Boolean).join(", ") || null} />
                        <Field label="LinkedIn" value={app.linkedin_url} link />
                        <Field label="Employment status" value={app.employment_status} />
                        <Field label="Current job title" value={app.current_job_title} />
                        <Field label="Years of experience" value={app.years_of_experience} />
                        <Field label="Highest qualification" value={app.highest_qualification} />
                        <Field label="Industry" value={app.industry} />
                        <Field label="Expected salary" value={app.expected_salary} />
                        <Field label="Preferred work types" value={app.preferred_work_types?.join(", ") || null} />
                        <Field label="Career interests" value={app.career_interests?.join(", ") || null} />
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
        )}
      </div>
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