import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/components/home/HomePage';

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({
    meta: [
      { title: 'Powers Consult — Your HR Department. Without the HR Department.' },
      {
        name: 'description',
        content:
          'Powers Consult is the outsourced HR partner that builds and manages the people, processes, systems, documentation, compliance and advisory behind your workforce.',
      },
      { property: 'og:title', content: 'Powers Consult — Your HR Department. Without the HR Department.' },
      {
        property: 'og:description',
        content:
          'One external HR partner building and managing the full HR function behind startups, SMEs and growing businesses. Book an HR consultation.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
});
