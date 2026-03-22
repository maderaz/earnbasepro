import type { Metadata } from 'next';
import { ControlRoomClient } from './ControlRoomClient';

export const metadata: Metadata = {
  title: 'Control Room | Earnbase',
  description: 'Internal admin panel.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function ControlRoomPage() {
  return <ControlRoomClient />;
}
