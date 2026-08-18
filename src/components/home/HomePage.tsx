import { Link } from '@tanstack/react-router';
import {
  ArrowRight, ShieldCheck, FileText, HeartHandshake, FolderOpen, Users,
  MonitorSmartphone, Gauge, UserPlus, ClipboardList, MessageSquare, Workflow, Compass,
  Check, Building2, Briefcase, Layers, Cog, BookOpen, Scale, Lightbulb,
} from 'lucide-react';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';

const processSteps = [
  {
    number: '01',
    title: 'Understand',
    body: 'We learn how your business operates, understand your workforce and identify gaps.',
  },
  {
    number: '02',
    title: 'Build',
    body: 'We establish the policies, documentation, employee records, processes and systems your business needs.',
  },
  {
    number: '03',
    title: 'Manage',
    body: 'We handle recurring HR processes and provide ongoing HR support.',
  },
  {
    number: '04',
    title: 'Advise',
    body: 'We provide HR recommendations, identify risks and support management with people-related decisions.',
  },
  {
    number: '05',
    title: 'Improve',
    body: 'We continuously refine the HR function as the business grows.',
  },
];

const serviceCategories = [
  {
    label: 'HR Operations',
    icon: MonitorSmartphone,
    items: [
      'HR Information Systems (HRIS)',
      'General HR administration',
      'Staff communication & support',
    ],
  },
  {
    label: 'Policies & Documentation',
    icon: FileText,
    items: [
      'HR policy development & implementation',
      'Employee records & HR documentation',
      'Process development & documentation',
    ],
  },
  {
    label: 'Compliance',
    icon: ShieldCheck,
    items: [
      'HR compliance & regulatory requirements',
      'Risk identification & management',
      'Statutory obligations & reporting',
    ],
  },
  {
    label: 'People & Performance',
    icon: Users,
    items: [
      'Performance management systems',
      'HMO & employee welfare coordination',
      'Ongoing HR advisory services',
    ],
  },
  {
    label: 'Recruitment & Onboarding',
    icon: UserPlus,
    items: [
      'Staff recruitment & talent sourcing',
      'Employee onboarding & offboarding',
      'Talent pool management',
    ],
  },
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

      {/* SECTION 1 - HERO */}
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
                href="#about"
                className="inline-flex items-center justify-center rounded-[8px] border border-border bg-white px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-[var(--teal)] hover:text-[var(--navy)]"
              >
                Learn More
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

      {/* SECTION 2 — ABOUT */}
      <section id="about" className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionLabel>About Powers Consult</SectionLabel>
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
                One HR Partner.
                <br />
                One Integrated Function.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-[1.7] text-muted-foreground">
              <p>
                Powers Consult takes responsibility for the whole HR function — designed, documented and managed as one system.
              </p>
              <p>
                We work with startups, SMEs and growing businesses whose workforce has outgrown informal HR, but who do not need, or want, an internal HR department to get it right.
              </p>
              <p>
                Business owners focus on running the business. Powers Consult builds and runs everything behind the employees.
              </p>
              <Link
                to="/consultation"
                className="mt-3 inline-flex items-center gap-2 rounded-[8px] bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--navy-deep)]"
              >
                Book an HR Consultation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW POWERS WORKS */}
      <section id="how-it-works" className="bg-[var(--navy)] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              How Powers Works
            </p>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              A five-step partnership built around your business
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <div
                key={step.number}
                className="group relative overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.03] p-7 transition-all hover:border-[var(--teal)]/40 hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[8px] bg-[var(--teal)] text-lg font-bold text-[var(--navy)]">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-bold tracking-[-0.01em]">{step.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-[1.7] text-white/70">{step.body}</p>
                {index !== processSteps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-white/10 lg:block">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — WHAT WE MANAGE */}
      <section id="services" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>What we manage</SectionLabel>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              The HR Infrastructure Behind Your Workforce
            </h2>
            <p className="mt-4 text-base leading-[1.65] text-muted-foreground">
              We build and manage the core HR functions your business needs to operate professionally as it grows.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map(category => (
              <div
                key={category.label}
                className="rounded-[16px] border border-border bg-white p-6 transition-colors hover:border-[var(--teal)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--navy)] text-white">
                  <category.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-bold tracking-[-0.01em] text-[var(--navy)]">{category.label}</h3>
                <ul className="mt-4 space-y-2.5">
                  {category.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--teal)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — WHERE WE FIT */}
      <section className="border-t border-border py-20 sm:py-28">
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

      {/* TWO WAYS TO WORK WITH US */}
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
