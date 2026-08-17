import { useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Check, Loader2, CalendarCheck, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { supabase } from '@/integrations/supabase/client';

const needs = [
  'HR compliance & statutory requirements',
  'HR policies & employee handbook',
  'Employee records & documentation',
  'HR systems (HRIS) & process setup',
  'Onboarding & offboarding',
  'Performance management',
  'Employee benefits & HMO coordination',
  'Recruitment support',
  'Ongoing HR advisory',
  'Not sure yet — need guidance',
];

const inputClass =
  'w-full rounded-[8px] border border-border bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}

export function ConsultationPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const toggle = (n: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const { error } = await supabase.from('consultation_requests').insert({
        full_name: String(fd.get('full_name') ?? '').trim(),
        work_email: String(fd.get('work_email') ?? '').trim(),
        phone: (fd.get('phone') as string)?.trim() || null,
        company_name: String(fd.get('company_name') ?? '').trim(),
        company_size: (fd.get('company_size') as string) || null,
        industry: (fd.get('industry') as string) || null,
        current_hr_setup: (fd.get('current_hr_setup') as string) || null,
        preferred_contact: (fd.get('preferred_contact') as string) || null,
        message: (fd.get('message') as string) || null,
        hr_needs: Array.from(selected),
      });
      if (error) throw error;
      toast.success('Consultation request received — we will be in touch.');
      formRef.current?.reset();
      setSelected(new Set());
      setDone(true);
    } catch (err) {
      console.error('Consultation request failed', err);
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <SiteNav />

      <section className="bg-white pt-24 sm:pt-28">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center sm:px-8 sm:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
            For business owners & management teams
          </p>
          <h1 className="text-3xl font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
            Book an <span className="text-[var(--navy)]">HR Consultation</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-[1.65] text-muted-foreground sm:text-lg">
            Tell us about your business and your workforce. We will review your current HR setup and outline how
            Powers Consult can build and run the HR function behind your company.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Looking for a role instead?{' '}
            <Link to="/recruitment" className="font-semibold text-[var(--navy)] underline underline-offset-4">
              Join the talent pool
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <div className="rounded-[24px] border border-border bg-white p-6 sm:p-10">
            {done ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--teal)] text-white">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-2xl font-bold tracking-[-0.02em]">Request received</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-[1.65] text-muted-foreground">
                  Thank you. Our team will review your details and reach out to arrange your consultation.
                </p>
                <button
                  onClick={() => setDone(false)}
                  className="mt-7 inline-flex items-center gap-2 rounded-[8px] border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-[var(--teal)]"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                <fieldset className="space-y-4">
                  <legend className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-[var(--navy)]">
                    Your details
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name">
                      <input name="full_name" required className={inputClass} placeholder="Jane Doe" />
                    </Field>
                    <Field label="Work Email">
                      <input name="work_email" type="email" required className={inputClass} placeholder="jane@company.com" />
                    </Field>
                    <Field label="Phone Number">
                      <input name="phone" className={inputClass} placeholder="+234…" />
                    </Field>
                    <Field label="Preferred Contact Method">
                      <select name="preferred_contact" className={inputClass} defaultValue="">
                        <option value="">Select…</option>
                        <option>Email</option>
                        <option>Phone call</option>
                        <option>Video call</option>
                        <option>WhatsApp</option>
                      </select>
                    </Field>
                  </div>
                </fieldset>

                <fieldset className="space-y-4">
                  <legend className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-[var(--navy)]">
                    Your company
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Company Name">
                      <input name="company_name" required className={inputClass} placeholder="Company Ltd." />
                    </Field>
                    <Field label="Industry">
                      <input name="industry" className={inputClass} placeholder="e.g. Technology" />
                    </Field>
                    <Field label="Number of Employees">
                      <select name="company_size" className={inputClass} defaultValue="">
                        <option value="">Select…</option>
                        <option>1–10</option>
                        <option>11–50</option>
                        <option>51–100</option>
                        <option>101–250</option>
                        <option>250+</option>
                      </select>
                    </Field>
                    <Field label="Current HR Setup">
                      <select name="current_hr_setup" className={inputClass} defaultValue="">
                        <option value="">Select…</option>
                        <option>No dedicated HR</option>
                        <option>Handled by admin or operations staff</option>
                        <option>One HR person</option>
                        <option>Small internal HR team</option>
                        <option>Currently using another provider</option>
                      </select>
                    </Field>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-[var(--navy)]">
                    What do you need support with?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {needs.map(n => {
                      const active = selected.has(n);
                      return (
                        <button
                          type="button"
                          key={n}
                          onClick={() => toggle(n)}
                          aria-pressed={active}
                          className={`inline-flex items-center gap-1.5 rounded-[8px] border px-3.5 py-2 text-xs font-semibold transition-colors ${
                            active
                              ? 'border-[var(--navy)] bg-[var(--navy)] text-white'
                              : 'border-border bg-white text-foreground hover:border-[var(--teal)]'
                          }`}
                        >
                          {active && <Check className="h-3 w-3" strokeWidth={3} />}
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <Field label="Anything else we should know?">
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={4000}
                    className={inputClass}
                    placeholder="Briefly describe your workforce and what you would like to solve."
                  />
                </Field>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--navy)] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[var(--navy-deep)] disabled:opacity-60 sm:w-auto"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {submitting ? 'Sending…' : 'Request Consultation'}
                </button>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> Prefer email? Write to hello@powersconsult.com.ng
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}