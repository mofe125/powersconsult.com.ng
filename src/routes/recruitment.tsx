import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/components/landing/LandingPage';

export const Route = createFileRoute('/recruitment')({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: 'Recruitment & Talent Pool — Powers Consult' },
      {
        name: 'description',
        content:
          'Recruitment inside a complete HR function. Join the Powers Consult talent pool: create your profile, upload your CV and be considered for roles across the businesses we support.',
      },
      { property: 'og:title', content: 'Recruitment & Talent Pool — Powers Consult' },
      {
        property: 'og:description',
        content: 'Create your talent profile and be considered for roles shaped by the HR functions Powers Consult manages.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
});