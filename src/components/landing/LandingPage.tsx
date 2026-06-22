import { Link } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, Menu, X, UserPlus, FileUp, Sparkles, Layers, Briefcase, GraduationCap,
  ShieldCheck, BadgeCheck, Search, Bell, Check, Star, Linkedin, Mail, Phone, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { PowerConsultLogo } from '@/components/brand/PowerConsultLogo';
import { supabase } from '@/integrations/supabase/client';

const services = [
  { icon: UserPlus, title: 'Create Your Profile', body: 'Build your professional profile by adding your education, experience, skills, certifications, and career interests.' },
  { icon: FileUp, title: 'Upload Your CV', body: 'Securely upload your CV and keep it available for recruiters searching for qualified professionals.' },
  { icon: Sparkles, title: 'Smart Job Matching', body: 'Receive personalized job recommendations based on your skills, qualifications, and selected career interests.' },
  { icon: Layers, title: 'Multiple Job Interests', body: 'Select more than one job title or career path to increase your visibility across different opportunities.', tags: ['Human Resources', 'Customer Success', 'Software Engineering', 'Product Management', 'Finance', 'Legal', 'Sales', 'Marketing'] },
  { icon: Briefcase, title: 'Recruitment Support', body: 'Our HR professionals carefully review candidate profiles and connect qualified applicants with employers looking for top talent.' },
  { icon: GraduationCap, title: 'Career Development', body: 'Access career resources designed to help you strengthen your CV, prepare for interviews, and grow professionally.' },
];

const aboutBullets = [
  'Secure Candidate Profiles',
  'Multiple Career Interests',
  'Intelligent Job Matching',
  'Trusted by Employers',
];

const steps = [
  { num: '01', title: 'Create Your Account', body: 'Register with your basic personal and professional information.' },
  { num: '02', title: 'Upload Your CV', body: 'Upload your latest CV and supporting certifications.' },
  { num: '03', title: 'Choose Career Interests', body: 'Select multiple job titles, industries, and locations that interest you.' },
  { num: '04', title: 'Get Matched', body: 'Receive suitable job opportunities and be contacted when employers find your profile.' },
];

const whyItems = [
  { icon: Search, title: 'We Help You Get Discovered' },
  { icon: Layers, title: 'Multiple Job Preferences' },
  { icon: ShieldCheck, title: 'Secure CV Database' },
  { icon: BadgeCheck, title: 'Verified Employer Network' },
  { icon: Sparkles, title: 'Faster Recruitment Process' },
  { icon: GraduationCap, title: 'Career Growth Opportunities' },
  { icon: Bell, title: 'Personalized Job Recommendations' },
  { icon: Star, title: 'Trusted by Top Employers' },
];

const careerInterests = [
  'Human Resources', 'Finance', 'Customer Service', 'Marketing', 'Sales',
  'Product Management', 'Data Analysis', 'UI/UX', 'Software Engineering',
  'Business Development', 'Legal', 'Administration', 'Procurement',
  'Operations', 'Project Management', 'Others',
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
      {children}
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'w-full rounded-[8px] border border-border bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20 transition-colors';

export function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<Record<string, File | null>>({
    cv: null, cover_letter: null, portfolio: null, certificates: null,
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleInterest = (i: string) => {
    setInterests(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const onFileChange = (key: string, file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error(`${file.name} exceeds the 10MB limit.`);
      return;
    }
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const uploadDoc = async (applicationId: string, key: string, file: File | null) => {
    if (!file) return null;
    const ext = file.name.split('.').pop() ?? 'bin';
    const path = `${applicationId}/${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('applications')
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    return path;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    if (!files.cv) {
      toast.error('Please upload your CV to continue.');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const workTypes = fd.getAll('preferred_work_types').map(String);

      const applicationId = crypto.randomUUID();

      const [cv_path, cover_letter_path, portfolio_path, certificates_path] = await Promise.all([
        uploadDoc(applicationId, 'cv', files.cv),
        uploadDoc(applicationId, 'cover-letter', files.cover_letter),
        uploadDoc(applicationId, 'portfolio', files.portfolio),
        uploadDoc(applicationId, 'certificates', files.certificates),
      ]);

      const payload = {
        id: applicationId,
        full_name: String(fd.get('full_name') ?? '').trim(),
        email: String(fd.get('email') ?? '').trim(),
        phone: String(fd.get('phone') ?? '').trim() || null,
        date_of_birth: (fd.get('date_of_birth') as string) || null,
        gender: (fd.get('gender') as string) || null,
        state: (fd.get('state') as string) || null,
        city: (fd.get('city') as string) || null,
        linkedin_url: (fd.get('linkedin_url') as string) || null,
        employment_status: (fd.get('employment_status') as string) || null,
        current_job_title: (fd.get('current_job_title') as string) || null,
        years_of_experience: (fd.get('years_of_experience') as string) || null,
        highest_qualification: (fd.get('highest_qualification') as string) || null,
        industry: (fd.get('industry') as string) || null,
        expected_salary: (fd.get('expected_salary') as string) || null,
        skills: (fd.get('skills') as string) || null,
        certifications: (fd.get('certifications') as string) || null,
        preferred_work_types: workTypes,
        career_interests: Array.from(interests),
        cv_path,
        cover_letter_path,
        portfolio_path,
        certificates_path,
      };

      const { error } = await supabase.from('applications').insert(payload);
      if (error) throw error;

      toast.success("Application received — we'll be in touch shortly.");
      formRef.current?.reset();
      setFiles({ cv: null, cover_letter: null, portfolio: null, certificates: null });
      setInterests(new Set());
    } catch (err) {
      console.error('Application submission failed', err);
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const navLinks: [string, string][] = [
    ['Services', 'services'],
    ['About', 'about'],
    ['How it works', 'process'],
    ['Join', 'register'],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-border bg-background/85 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <PowerConsultLogo size="md" />
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </button>
            ))}
            <Link
              to="/admin"
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
            <button
              onClick={() => scrollTo('register')}
              className="rounded-[8px] bg-[var(--navy)] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--navy-deep)]"
            >
              Join Talent Pool
            </button>
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-[8px] text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileNavOpen && (
          <div className="border-t border-border bg-background px-6 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="rounded-[8px] px-3 py-2.5 text-left text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  {label}
                </button>
              ))}
              <Link
                to="/admin"
                className="rounded-[8px] px-3 py-2.5 text-left text-sm font-semibold text-foreground hover:bg-secondary"
                onClick={() => setMobileNavOpen(false)}
              >
                Admin
              </Link>
              <button
                onClick={() => scrollTo('register')}
                className="mt-2 rounded-[8px] bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Join Talent Pool
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ━━━ HERO ━━━ */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-[var(--teal-soft)] opacity-60 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[var(--navy)]/[0.08] blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
                Trusted recruitment partner
              </div>
              <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-[56px]">
                Your Next Career <span className="text-[var(--navy)]">Opportunity</span> Starts Here
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-[1.65] text-muted-foreground sm:text-lg">
                Powers Consult connects exceptional talent with innovative startups, technology companies, SMEs, and tech organizations.
              </p>
              <p className="mx-auto mt-4 max-w-xl text-base leading-[1.65] text-muted-foreground">
                Create your profile, upload your CV, select multiple career interests, and get matched with opportunities that fit your skills and ambitions.
              </p>
              <div className="mx-auto mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => scrollTo('register')}
                  className="group inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--navy)] px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-[var(--navy-deep)] hover:shadow-lg hover:shadow-[var(--navy)]/20"
                >
                  Join Our Talent Pool
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => scrollTo('services')}
                  className="inline-flex items-center justify-center rounded-[8px] border border-border bg-white px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-[var(--teal)] hover:text-[var(--navy)]"
                >
                  Explore Opportunities
                </button>
              </div>
              <div className="mx-auto mt-10 flex items-center justify-center gap-6 text-xs font-semibold text-muted-foreground">
                <div><span className="block text-2xl font-bold text-foreground">10k+</span>Candidates</div>
                <div className="h-8 w-px bg-border" />
                <div><span className="block text-2xl font-bold text-foreground">500+</span>Employers</div>
                <div className="h-8 w-px bg-border" />
                <div><span className="block text-2xl font-bold text-foreground">95%</span>Match rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ ABOUT ━━━ */}
      <section id="about" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="relative">
              <div className="absolute -left-3 top-6 hidden h-full w-1 rounded-full bg-[var(--teal)] lg:block" />
              <div className="rounded-[24px] bg-gradient-to-br from-[var(--navy)] to-[var(--navy-deep)] p-10 text-white shadow-xl shadow-[var(--navy)]/20">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { k: '10,000+', v: 'Professionals to be onboarded' },
                    { k: '500+', v: 'Employers to be verified' },
                    { k: '40+', v: 'Industries to be served\u00a0' },
                    { k: '24h', v: 'Average response time' },
                  ].map((stat, i) => (
                    <div key={i} className="rounded-[12px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                      <p className="text-3xl font-bold tracking-[-0.02em] text-white">{stat.k}</p>
                      <p className="mt-1 text-xs text-white/70">{stat.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <SectionLabel>ABOUT POWERS CONSULT</SectionLabel>
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
                Connecting Great Talent with Great Companies
              </h2>
              <div className="mt-6 space-y-4 text-base leading-[1.65] text-muted-foreground">
                <p>At Powers Consult, we believe every talented professional deserves the right opportunity.</p>
                <p>Our recruitment platform helps candidates showcase their experience while enabling employers to discover skilled professionals quickly and efficiently.</p>
                <p>Whether you're a fresh graduate, an experienced professional, or an executive, we're committed to helping you find opportunities where you can thrive.</p>
              </div>
              <ul className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {aboutBullets.map(b => (
                  <li key={b} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--teal)] text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => scrollTo('process')}
                className="mt-8 inline-flex items-center gap-2 rounded-[8px] border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-[var(--teal)] hover:text-[var(--navy)]"
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ PROCESS ━━━ */}
      <section id="process" className="relative bg-[var(--navy)] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">The process</p>
            <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Your Journey to Your Next Role</h2>
            <p className="mt-4 text-base leading-[1.65] text-white/70">
              A simple process designed to help you connect with the right opportunities.
            </p>
          </div>
          <ol className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li
                key={i}
                className="relative rounded-[16px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition-colors hover:border-[var(--teal)]/40"
              >
                <span className="text-xs font-bold tracking-[0.2em] text-[var(--teal)]">STEP {step.num}</span>
                <h3 className="mt-3 text-lg font-bold tracking-[-0.01em] text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-[1.65] text-white/70">{step.body}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-[var(--teal)]/60 lg:block" />
                )}
              </li>
            ))}
          </ol>

          <div className="mt-20 rounded-[24px] border border-white/10 bg-white/[0.03] p-8 sm:p-12 backdrop-blur">
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="text-2xl font-bold tracking-[-0.01em] sm:text-3xl">Why Choose Powers Consult?</h3>
              <p className="mt-3 text-sm text-white/70">Built to give candidates real visibility and employers high-signal matches.</p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {whyItems.map(w => (
                <div key={w.title} className="flex items-start gap-3 rounded-[12px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] bg-[var(--teal)] text-[var(--navy)]">
                    <w.icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold leading-tight text-white">{w.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ REGISTRATION FORM ━━━ */}
      <section id="register" className="relative bg-secondary/40 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <div className="text-center">
            <SectionLabel>Get started</SectionLabel>
            <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">Create Your Talent Profile</h2>
            <p className="mt-4 text-base leading-[1.65] text-muted-foreground">
              Tell us about yourself. We'll match your profile with employers actively hiring for roles that fit.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="mt-12 space-y-10 rounded-[20px] border border-border bg-white p-6 shadow-xl shadow-[var(--navy)]/5 sm:p-10">
            {/* Personal */}
            <fieldset>
              <legend className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-[var(--navy)]">
                <span className="h-px w-8 bg-[var(--teal)]" /> Personal Information
              </legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full Name"><input name="full_name" required className={inputClass} placeholder="Jane Doe" /></Field>
                <Field label="Email Address"><input name="email" required type="email" className={inputClass} placeholder="jane@example.com" /></Field>
                <Field label="Phone Number"><input name="phone" required className={inputClass} placeholder="+234 800 000 0000" /></Field>
                <Field label="Date of Birth"><input name="date_of_birth" type="date" className={inputClass} /></Field>
                <Field label="Gender">
                  <select name="gender" className={inputClass} defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
                  </select>
                </Field>
                <Field label="State"><input name="state" className={inputClass} placeholder="Lagos" /></Field>
                <Field label="City"><input name="city" className={inputClass} placeholder="Ikeja" /></Field>
                <Field label="LinkedIn Profile (Optional)"><input name="linkedin_url" className={inputClass} placeholder="linkedin.com/in/…" /></Field>
              </div>
            </fieldset>

            {/* Professional */}
            <fieldset>
              <legend className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-[var(--navy)]">
                <span className="h-px w-8 bg-[var(--teal)]" /> Professional Information
              </legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Current Employment Status">
                  <select name="employment_status" className={inputClass} defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Employed</option><option>Unemployed</option><option>Freelance</option><option>Student</option>
                  </select>
                </Field>
                <Field label="Current Job Title"><input name="current_job_title" className={inputClass} placeholder="Product Manager" /></Field>
                <Field label="Years of Experience">
                  <select name="years_of_experience" className={inputClass} defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>0–1 years</option><option>2–4 years</option><option>5–7 years</option><option>8–10 years</option><option>10+ years</option>
                  </select>
                </Field>
                <Field label="Highest Qualification">
                  <select name="highest_qualification" className={inputClass} defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Secondary School</option><option>Diploma</option><option>Bachelor's</option><option>Master's</option><option>PhD</option>
                  </select>
                </Field>
                <Field label="Industry"><input name="industry" className={inputClass} placeholder="Technology" /></Field>
                <Field label="Expected Salary"><input name="expected_salary" className={inputClass} placeholder="e.g. ₦500,000 / month" /></Field>
                <div className="sm:col-span-2">
                  <Field label="Skills"><input name="skills" className={inputClass} placeholder="React, Python, Stakeholder management…" /></Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Certifications"><input name="certifications" className={inputClass} placeholder="PMP, AWS Solutions Architect…" /></Field>
                </div>
              </div>
              <div className="mt-5">
                <span className="mb-2 block text-xs font-semibold text-foreground">Preferred Work Type</span>
                <div className="flex flex-wrap gap-2">
                  {['Remote', 'Hybrid', 'On-site'].map(w => (
                    <label key={w} className="flex cursor-pointer items-center gap-2 rounded-[8px] border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors has-[:checked]:border-[var(--teal)] has-[:checked]:bg-[var(--teal-soft)]">
                      <input type="checkbox" name="preferred_work_types" value={w} className="accent-[var(--teal)]" />
                      {w}
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>

            {/* Career Interests */}
            <fieldset>
              <legend className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-[var(--navy)]">
                <span className="h-px w-8 bg-[var(--teal)]" /> Career Interests
              </legend>
              <p className="mb-4 text-xs text-muted-foreground">Select all that apply — multiple selections boost your visibility.</p>
              <div className="flex flex-wrap gap-2">
                {careerInterests.map(i => {
                  const active = interests.has(i);
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => toggleInterest(i)}
                      className={`rounded-[8px] border px-3.5 py-2 text-xs font-semibold transition-all ${
                        active
                          ? 'border-[var(--teal)] bg-[var(--teal-soft)] text-[var(--navy)]'
                          : 'border-border bg-white text-muted-foreground hover:border-[var(--teal)]/60 hover:text-foreground'
                      }`}
                    >
                      {active && <Check className="mr-1 inline h-3 w-3" strokeWidth={3} />}
                      {i}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Uploads */}
            <fieldset>
              <legend className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-[var(--navy)]">
                <span className="h-px w-8 bg-[var(--teal)]" /> Upload Documents
              </legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { key: 'cv', label: 'Upload CV', required: true },
                  { key: 'cover_letter', label: 'Cover Letter (Optional)' },
                  { key: 'portfolio', label: 'Portfolio (Optional)' },
                  { key: 'certificates', label: 'Certificates (Optional)' },
                ].map(({ key, label, required }) => {
                  const selected = files[key];
                  return (
                    <label key={key} className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-dashed border-border bg-secondary/40 px-4 py-4 text-sm text-foreground transition-colors hover:border-[var(--teal)] hover:bg-[var(--teal-soft)]/40">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] bg-white text-[var(--navy)] shadow-sm">
                        <FileUp className="h-4 w-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold">{label}{required && <span className="text-[var(--teal)]"> *</span>}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {selected ? selected.name : 'PDF, DOC, DOCX up to 10MB'}
                        </span>
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="sr-only"
                        onChange={(e) => onFileChange(key, e.target.files?.[0] ?? null)}
                      />
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-col items-center gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between">
              <p className="text-xs text-muted-foreground">By submitting, you agree to our terms of service and privacy policy.</p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--navy)] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[var(--navy-deep)] hover:shadow-lg hover:shadow-[var(--navy)]/25 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {submitting ? <>Submitting… <Loader2 className="h-4 w-4 animate-spin" /></> : <>Join the Talent Pool <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ━━━ FOOTER CTA ━━━ */}
      <section className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[var(--navy)] to-[var(--navy-deep)] p-10 text-center text-white sm:p-16">
            <div className="pointer-events-none absolute -top-20 right-0 h-80 w-80 rounded-full bg-[var(--teal)]/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Ready to Take the Next Step?</h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-[1.65] text-white/75">
                Create your profile today and let Powers Consult connect you with employers looking for talent like yours.
              </p>
              <button
                onClick={() => scrollTo('register')}
                className="group mt-9 inline-flex items-center gap-2 rounded-[8px] bg-[var(--teal)] px-8 py-3.5 text-base font-bold text-[var(--navy-deep)] transition-all hover:bg-white"
              >
                Get Started Today <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <PowerConsultLogo size="md" />
              <p className="mt-4 max-w-xs text-sm leading-[1.65] text-muted-foreground">
                Connecting exceptional talent with innovative organizations.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">Platform</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollTo('services')} className="hover:text-foreground">Services</button></li>
                <li><button onClick={() => scrollTo('process')} className="hover:text-foreground">How it works</button></li>
                <li><button onClick={() => scrollTo('register')} className="hover:text-foreground">Join</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollTo('about')} className="hover:text-foreground">About</button></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
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
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Powers Consult. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Built for talented professionals everywhere.</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}