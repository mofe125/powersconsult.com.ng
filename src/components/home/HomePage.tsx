import { Link } from '@tanstack/react-router';
import {
  ArrowRight, ShieldCheck, FileText, PiggyBank, HeartHandshake, FolderOpen, Users,
  MonitorSmartphone, Gauge, UserPlus, ClipboardList, MessageSquare, Workflow, Compass,
  Check, Mail, Phone, Linkedin,
} from 'lucide-react';
import { SiteNav } from '@/components/layout/SiteNav';
import { PowerConsultLogo } from '@/components/brand/PowerConsultLogo';

const functions = [
  { icon: ShieldCheck, title: 'HR compliance & regulatory requirements' },
  { icon: FileText, title: 'HR policy development & implementation' },
  { icon: PiggyBank, title: 'Pension & employee benefits administration' },
  { icon: HeartHandshake, title: 'HMO & employee welfare coordination' },
  { icon: FolderOpen, title: 'Employee records & HR documentation' },
  { icon: UserPlus, title: 'Staff recruitment' },
  { icon: MonitorSmartphone, title: 'HR Information Systems (HRIS)' },
  { icon: Gauge, title: 'Performance management systems' },
  { icon: ClipboardList, title: 'Employee onboarding & offboarding' },
  { icon: Users, title: 'General HR administration' },
  { icon: MessageSquare, title: 'Staff communication & support' },
  { icon: Workflow, title: 'Process development & documentation' },
  { icon: Compass, title: 'Ongoing HR advisory services' },
];

const benefits = [
  'Professional and unbiased HR policies',
  'Standardized HR systems tailored to your business',
  'Access to multiple HR functions through one provider',
  'Reduced staffing costs — no need for several HR specialists',
  'Improved compliance with labour and statutory requirements',
  'Streamlined HR processes that scale as you grow',
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
            <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-[56px]">
              Your Complete <span className="text-[var(--navy)]">HR Department</span>, Fully Outsourced
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.65] text-muted-foreground sm:text-lg">
              Powers Consult is an outsourced Human Resources consultancy designed to function as your company's
              complete HR department — one trusted partner overseeing every aspect of human resource management
              through efficient systems, technology, and standardized processes.
            </p>
            <div className="mx-auto mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/recruitment"
                className="group inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--navy)] px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-[var(--navy-deep)] hover:shadow-lg hover:shadow-[var(--navy)]/20"
              >
                Explore Recruitment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-[8px] border border-border bg-white px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-[var(--teal)] hover:text-[var(--navy)]"
              >
                What We Do
              </a>
            </div>
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
                  Rather than hiring multiple HR professionals to manage different functions, Powers Consult provides
                  an integrated solution where one trusted partner oversees every aspect of human resource management.
                </p>
                <p>
                  Our goal is to enable business owners — particularly startups and small to medium-sized businesses —
                  to focus on growing their companies while we handle the complexities of managing their workforce.
                </p>
                <p>
                  Business owners only need to focus on running their businesses. Powers Consult manages everything
                  related to their employees.
                </p>
              </div>
            </div>
            <div className="rounded-[24px] bg-gradient-to-br from-[var(--navy)] to-[var(--navy-deep)] p-10 text-white shadow-xl shadow-[var(--navy)]/20">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { k: '13+', v: 'Core HR functions covered' },
                  { k: '1', v: 'Integrated service provider' },
                  { k: 'SME', v: 'Startups & growing businesses' },
                  { k: '24h', v: 'Average response time' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-[12px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                    <p className="text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">{stat.k}</p>
                    <p className="mt-1 text-xs text-white/70">{stat.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section id="services" className="bg-[var(--navy)] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              What Powers Consult does
            </p>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              Your External Human Resources Department
            </h2>
            <p className="mt-4 text-base leading-[1.65] text-white/70">
              We serve as your company's HR department by managing all core HR functions.
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

      {/* VALUE PROPOSITION */}
      <section id="value" className="py-20 sm:py-28">
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
                  Powers Consult provides independent, objective HR management instead.
                </p>
                <p>
                  Rather than employing separate personnel for payroll, compliance, HR administration, performance
                  management, and employee records, businesses receive all these services through one integrated solution.
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
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[var(--navy)] to-[var(--navy-deep)] p-10 text-center text-white sm:p-16">
            <div className="pointer-events-none absolute -top-20 right-0 h-80 w-80 rounded-full bg-[var(--teal)]/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Let Us Handle HR While You Grow</h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-[1.65] text-white/75">
                Talk to us about running your HR end to end — or join our talent pool if you're looking for your next role.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="mailto:hello@powersconsult.com"
                  className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--teal)] px-8 py-3.5 text-base font-bold text-[var(--navy-deep)] transition-all hover:bg-white"
                >
                  Talk to Us <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/recruitment"
                  className="inline-flex items-center gap-2 rounded-[8px] border border-white/25 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Join Talent Pool
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <PowerConsultLogo size="md" />
              <p className="mt-4 max-w-xs text-sm leading-[1.65] text-muted-foreground">
                Outsourced HR consultancy serving as your complete human resources department.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">Navigate</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Home</Link></li>
                <li><Link to="/recruitment" className="hover:text-foreground">Recruitment</Link></li>
                <li><Link to="/admin" className="hover:text-foreground">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">Contact</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> hello@powersconsult.com</li>
                <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +234 800 000 0000</li>
                <li className="flex items-center gap-2"><Linkedin className="h-3.5 w-3.5" /> /powersconsult</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Powers Consult. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}