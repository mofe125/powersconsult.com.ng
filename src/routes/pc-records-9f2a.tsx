import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { fetchAllData } from "@/lib/admin.functions";

export const Route = createFileRoute("/pc-records-9f2a")({
  head: () => ({
    meta: [
      { title: "Records — Powers Consult" },
      { name: "description", content: "Private records view for Powers Consult staff." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Records — Powers Consult" },
      { property: "og:description", content: "Private records view for Powers Consult staff." },
    ],
  }),
  component: RecordsPage,
});

type Application = Record<string, any> & { files: { label: string; url: string }[] };
type Consultation = Record<string, any>;

function fmt(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

function fmtDate(value: unknown) {
  if (!value) return "—";
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? String(value) : d.toLocaleString();
}

function RecordsPage() {
  const load = useServerFn(fetchAllData);
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"applications" | "consultations">("applications");
  const [apps, setApps] = useState<Application[]>([]);
  const [cons, setCons] = useState<Consultation[]>([]);
  const [openRow, setOpenRow] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await load({ data: { password } });
      setApps(res.applications as Application[]);
      setCons(res.consultations as Consultation[]);
      setAuthed(true);
    } catch (err: any) {
      setError(err?.message || "Could not load records.");
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    setLoading(true);
    try {
      const res = await load({ data: { password } });
      setApps(res.applications as Application[]);
      setCons(res.consultations as Consultation[]);
    } catch (err: any) {
      setError(err?.message || "Could not refresh.");
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <form
          onSubmit={submit}
          className="w-full max-w-sm rounded-[16px] border border-border bg-white p-8"
        >
          <h1 className="text-xl font-bold text-foreground">Powers Consult records</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the access code to view submissions.
          </p>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Access code"
            className="mt-6 w-full rounded-[8px] border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
          />
          {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || !password}
            className="mt-4 w-full rounded-[8px] bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Checking…" : "View records"}
          </button>
        </form>
      </main>
    );
  }

  const rows = tab === "applications" ? apps : cons;

  return (
    <main className="min-h-screen bg-white px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Records</h1>
            <p className="text-sm text-muted-foreground">
              {apps.length} talent submissions · {cons.length} consultation requests
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="rounded-[8px] border border-border px-4 py-2 text-sm font-semibold text-foreground disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </header>

        <div className="mt-6 flex gap-2">
          {(["applications", "consultations"] as const).map(t => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setOpenRow(null);
              }}
              className={`rounded-[8px] px-4 py-2 text-sm font-semibold capitalize ${
                tab === t
                  ? "bg-[var(--navy)] text-white"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {error ? <p className="mt-4 text-xs text-red-600">{error}</p> : null}

        <div className="mt-6 space-y-3">
          {rows.length === 0 ? (
            <p className="rounded-[16px] border border-border p-8 text-center text-sm text-muted-foreground">
              No records yet.
            </p>
          ) : (
            rows.map((row: any) => {
              const open = openRow === row.id;
              return (
                <div key={row.id} className="rounded-[16px] border border-border bg-white">
                  <button
                    onClick={() => setOpenRow(open ? null : row.id)}
                    className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {fmt(row.full_name)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tab === "applications"
                          ? `${fmt(row.email)} · ${fmt(row.current_job_title)}`
                          : `${fmt(row.company_name)} · ${fmt(row.work_email)}`}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {fmtDate(row.created_at)}
                    </span>
                  </button>
                  {open ? (
                    <div className="border-t border-border px-5 py-4">
                      <dl className="grid gap-3 sm:grid-cols-2">
                        {Object.entries(row)
                          .filter(([k]) => k !== "files" && k !== "id")
                          .map(([k, v]) => (
                            <div key={k}>
                              <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                {k.replace(/_/g, " ")}
                              </dt>
                              <dd className="text-sm break-words text-foreground">
                                {k === "created_at" ? fmtDate(v) : fmt(v)}
                              </dd>
                            </div>
                          ))}
                      </dl>
                      {row.files?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {row.files.map((f: { label: string; url: string }) => (
                            <a
                              key={f.url}
                              href={f.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-[8px] border border-border px-3 py-1.5 text-xs font-semibold capitalize text-foreground hover:bg-secondary"
                            >
                              {f.label} ↗
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
