import { Link } from '@tanstack/react-router';
import { Mail, Phone } from 'lucide-react';
import { PowerConsultLogo } from '@/components/brand/PowerConsultLogo';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <PowerConsultLogo size="md" />
            <p className="mt-4 max-w-xs text-sm leading-[1.65] text-muted-foreground">
              Your HR department, without the HR department. Powers Consult is the external HR partner behind
              startups, SMEs and growing businesses.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">Navigate</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li><Link to="/consultation" className="hover:text-foreground">Book an HR Consultation</Link></li>
              <li><Link to="/recruitment" className="hover:text-foreground">Recruitment & Talent Pool</Link></li>
              <li><Link to="/admin" className="hover:text-foreground">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <a href="mailto:info@powerconsult.com.ng" className="hover:text-foreground">
                  info@powerconsult.com.ng
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <a href="tel:+2349072357502" className="hover:text-foreground">
                  (+234) 9072357502
                </a>
              </li>
            </ul>
            <Link
              to="/consultation"
              className="mt-5 inline-flex rounded-[8px] bg-[var(--navy)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--navy-deep)]"
            >
              Book an HR Consultation
            </Link>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Powers Consult. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}