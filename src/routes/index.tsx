import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/components/landing/LandingPage';

export const Route = createFileRoute('/')({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: 'Power Consult — Your Next Career Opportunity Starts Here' },
      {
        name: 'description',
        content:
          'Power Consult connects exceptional talent with innovative startups, technology companies, SMEs, and leading organizations. Create your profile and get matched.',
      },
    ],
  }),
});
