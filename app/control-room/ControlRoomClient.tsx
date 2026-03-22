'use client';

import { RegistryProvider } from '../hooks/useRegistry';
import { ControlRoom } from '../components/ControlRoom';

export function ControlRoomClient() {
  return (
    <RegistryProvider>
      <ControlRoom />
    </RegistryProvider>
  );
}
