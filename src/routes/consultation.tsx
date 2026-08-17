import { createFileRoute } from '@tanstack/react-router';
import { ConsultationPage } from '@/components/consultation/ConsultationPage';

export const Route = createFileRoute('/consultation')({
  component: ConsultationPage,
  head: () => ({
    meta: [
      { title: 'Book an HR Consultation — Powers Consult' },
      {
        name: 'description',
        content:
          'Book an HR consultation with Powers Consult, the external HR partner that builds and manages the HR function behind startups, SMEs and growing businesses.',
      },
      { property: 'og:title', content: 'Book an HR Consultation — Powers Consult' },
      {
        property: 'og:description',
        content:
          'Tell us about your workforce and we will outline how Powers Consult can run your HR function end to end.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
});