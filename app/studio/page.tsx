import type { Metadata } from 'next';
import { StudioClient } from './StudioClient';

export const metadata: Metadata = {
  title: 'Studio | Earnbase',
  description: 'Create shareable yield ranking graphics for social media.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function StudioPage() {
  return <StudioClient />;
}
