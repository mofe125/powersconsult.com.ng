import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/components/home/HomePage';

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({
    meta: [
      { title: 'Powers Consult — Outsourced HR Department for Growing Businesses' },
      {
        name: 'description',
        content:
          'Powers Consult is an outsourced HR consultancy acting as your complete HR department: compliance, policies, pensions, HMO, HRIS, performance and recruitment.',
      },
      { property: 'og:title', content: 'Powers Consult — Your Complete Outsourced HR Department' },
      {
        property: 'og:description',
        content:
          'One trusted partner managing HR compliance, policies, benefits, records, recruitment and advisory for startups and SMEs.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
});
