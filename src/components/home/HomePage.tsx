import { Link } from '@tanstack/react-router';
import {
  ArrowRight, ShieldCheck, FileText, HeartHandshake, FolderOpen, Users,
  MonitorSmartphone, Gauge, UserPlus, ClipboardList, MessageSquare, Workflow, Compass,
  Check, Building2, Briefcase, Layers, Cog, BookOpen, Scale, Lightbulb,
} from 'lucide-react';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';

const pillars = [
  { icon: Users, title: 'People', body: 'Experienced HR professionals accountable for your workforce, acting as your HR team without sitting on your payroll.' },
  { icon: Cog, title: 'Processes', body: 'Standardized, repeatable HR processes for hiring, onboarding, performance, exits and everyday employee matters.' },
  { icon: MonitorSmartphone, title: 'Systems', body: 'HR information systems and technology configured around your business so records and workflows live in one place.' },
  { icon: BookOpen, title: 'Documentation', body: 'Policies, handbooks, contracts, letters and employee records built and maintained to a professional standard.' },
  { icon: Scale, title: 'Compliance', body: 'HR practice aligned with labour and statutory requirements, so obligations are handled deliberately, not reactively.' },
  { icon: Lightbulb, title: 'Advisory', body: 'Ongoing guidance for founders and managers on structure, people decisions and difficult employee situations.' },
];

const functions = [
  { icon: ShieldCheck, title: 'HR compliance & regulatory requirements' },
  { icon: FileText, title: 'HR policy development & implementation' },
  { icon: HeartHandshake, title: 'HMO & employee welfare coordination' },
  { icon: FolderOpen, title: 'Employee records & HR documentation' },
  { icon: UserPlus, title: 'Staff recruitment & talent sourcing' },
  { icon: MonitorSmartphone, title: 'HR Information Systems (HRIS)' },
  { icon: Gauge, title: 'Performance management systems' },
  { icon: ClipboardList, title: 'Employee onboarding & offboarding' },
  { icon: Users, title: 'General HR administration' },
  { icon: MessageSquare, title: 'Staff communication & support' },
  { icon: Workflow, title: 'Process development & documentation' },
  { icon: Compass, title: 'Ongoing HR advisory services' },
];

const benefits = [
  'An HR function that exists from day one, without building a department',
  'Independent, objective HR judgement instead of HR by whoever is available',
  'Standardized HR systems and documentation tailored to your business',
  'One accountable partner across every HR function',
  'HR practice aligned with labour and statutory requirements',
  'Infrastructure that scales as your headcount grows',
];

const notPositioning = [
  { title: 'Not a recruitment agency', body: 'Recruitment sits inside the HR function we run for you — it is one part of the work, not the whole relationship.' },
  { title: 'Not an HR software vendor', body: 'We use technology to run your HR properly. You get a working HR function, not a tool to operate yourself.' },
  { title: 'Not a generic consultancy', body: 'We do not hand over a report and leave. Powers builds the HR infrastructure and stays responsible for running it.' },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
      {children}
    </p>
  );
}

export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="bg-white pt-24 sm:pt-28">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Outsourced HR partner for startups, SMEs & growing businesses
            </p>
            <h1 className="text-[34px] font-bold leading-[1.06] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-[58px]">
              Your HR Department.
              <br />
              <span className="text-[var(--navy)]">Without the HR Department.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.65] text-muted-foreground sm:text-lg">
              Powers Consult becomes your external HR partner — responsible for building, organizing and managing the
              HR infrastructure behind your workforce, so you can focus on running the business.
            </p>
            <div className="mx-auto mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/consultation"
                className="group inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--navy)] px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-[var(--navy-deep)] hover:shadow-lg hover:shadow-[var(--navy)]/20"
              >
                Book an HR Consultation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#model"
                className="inline-flex items-center justify-center rounded-[8px] border border-border bg-white px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-[var(--teal)] hover:text-[var(--navy)]"
              >
                See How It Works
              </a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Looking for your next role?{' '}
              <Link to="/recruitment" className="font-semibold text-[var(--navy)] underline underline-offset-4">
                Join the talent pool
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* THE MODEL — six pillars */}
      <section id="model" className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>The Powers model</SectionLabel>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              Six elements. One integrated HR function.
            </h2>
            <p className="mt-4 text-base leading-[1.65] text-muted-foreground">
              Most growing businesses have pieces of HR scattered across people and spreadsheets. Powers combines
              people, processes, systems, documentation, compliance and advisory into a single function you can rely on.
            </p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map(p => (
              <div
                key={p.title}
                className="group rounded-[16px] border border-border bg-white p-6 transition-colors hover:border-[var(--teal)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--navy)] text-white">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-[-0.01em]">{p.title}</h3>
                <p className="mt-2 text-sm leading-[1.65] text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionLabel>About Powers Consult</SectionLabel>
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
                One Partner Instead of a Full HR Team
              </h2>
              <div className="mt-6 space-y-4 text-base leading-[1.65] text-muted-foreground">
                <p>
                  Rather than assembling several HR professionals to cover different functions, Powers Consult takes
                  responsibility for the whole HR function — designed, documented and managed as one system.
                </p>
                <p>
                  We work with startups, SMEs and growing businesses whose workforce has outgrown informal HR, but who
                  do not need — or want — an internal HR department to get it right.
                </p>
                <p>
                  Business owners focus on running the business. Powers Consult builds and runs everything behind the
                  employees.
                </p>
              </div>
              <Link
                to="/consultation"
                className="mt-8 inline-flex items-center gap-2 rounded-[8px] bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--navy-deep)]"
              >
                Book an HR Consultation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-[24px] bg-gradient-to-br from-[var(--navy)] to-[var(--navy-deep)] p-10 text-white shadow-xl shadow-[var(--navy)]/20">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
                What the partnership covers
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  { icon: Layers, k: 'One integrated function', v: 'People, processes, systems, documentation, compliance and advisory under one partner.' },
                  { icon: Building2, k: 'Built for your business', v: 'HR infrastructure designed around your size, structure and how you actually operate.' },
                  { icon: Briefcase, k: 'Recruitment included', v: 'Hiring support sits inside the wider HR function when you need to grow the team.' },
                ].map(item => (
                  <li key={item.k} className="flex items-start gap-4 rounded-[12px] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] bg-[var(--teal)] text-[var(--navy)]">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.k}</p>
                      <p className="mt-1 text-xs leading-[1.6] text-white/70">{item.v}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section id="services" className="bg-[var(--navy)] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              What we manage
            </p>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              The HR Infrastructure Behind Your Workforce
            </h2>
            <p className="mt-4 text-base leading-[1.65] text-white/70">
              We build and manage the core HR functions your business needs to operate professionally as it grows.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {functions.map(f => (
              <div
                key={f.title}
                className="flex items-start gap-3 rounded-[16px] border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-[var(--teal)]/40"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] bg-[var(--teal)] text-[var(--navy)]">
                  <f.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold leading-snug text-white">{f.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POSITIONING CLARITY */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Where we fit</SectionLabel>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">An HR Partner, Not a Point Solution</h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {notPositioning.map(n => (
              <div key={n.title} className="rounded-[16px] border border-border bg-white p-7">
                <h3 className="text-base font-bold tracking-[-0.01em] text-[var(--navy)]">{n.title}</h3>
                <p className="mt-3 text-sm leading-[1.65] text-muted-foreground">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section id="value" className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionLabel>The value proposition</SectionLabel>
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
                Independent and Objective HR Management
              </h2>
              <div className="mt-6 space-y-4 text-base leading-[1.65] text-muted-foreground">
                <p>
                  In many small businesses, HR responsibilities are handled by administrative or operations staff.
                  Decisions become inconsistent, records go unmanaged and obligations get missed. Powers Consult
                  provides independent, objective HR management instead.
                </p>
                <p>
                  Rather than employing separate personnel for compliance, HR administration, performance management
                  and employee records, your business receives all of it through one integrated HR function.
                </p>
              </div>
            </div>
            <ul className="grid gap-3">
              {benefits.map(b => (
                <li
                  key={b}
                  className="flex items-start gap-3 rounded-[16px] border border-border bg-white p-5 text-sm font-medium text-foreground"
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--teal)] text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <SectionLabel>Two ways to work with us</SectionLabel>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Which describes you?</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[var(--navy)] to-[var(--navy-deep)] p-9 text-white sm:p-11">
              <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-[var(--teal)]/20 blur-3xl" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
                  For businesses
                </p>
                <h3 className="mt-4 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
                  I need an HR function for my company
                </h3>
                <p className="mt-4 text-sm leading-[1.7] text-white/75">
                  For business owners, founders and management teams who want their HR built, organized and managed by
                  one accountable partner.
                </p>
                <Link
                  to="/consultation"
                  className="mt-8 inline-flex items-center gap-2 rounded-[8px] bg-[var(--teal)] px-7 py-3.5 text-base font-bold text-[var(--navy-deep)] transition-all hover:bg-white"
                >
                  Book an HR Consultation <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="rounded-[24px] border border-border bg-white p-9 sm:p-11">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
                For professionals
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
                I am looking for my next role
              </h3>
              <p className="mt-4 text-sm leading-[1.7] text-muted-foreground">
                Join the Powers talent pool so your profile is considered when we recruit on behalf of the businesses
                whose HR we manage.
              </p>
              <Link
                to="/recruitment"
                className="mt-8 inline-flex items-center gap-2 rounded-[8px] border border-border px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-[var(--teal)] hover:text-[var(--navy)]"
              >
                Join Talent Pool <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}