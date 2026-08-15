import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/components/landing/LandingPage';

export const Route = createFileRoute('/recruitment')({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: 'Recruitment — Powers Consult Talent Pool' },
      {
        name: 'description',
        content:
          'Join the Powers Consult talent pool. Create your profile, upload your CV, choose career interests and get matched with employers actively hiring.',
      },
      { property: 'og:title', content: 'Recruitment — Powers Consult Talent Pool' },
      {
        property: 'og:description',
        content: 'Create your talent profile and get matched with employers hiring for roles that fit your skills.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
});