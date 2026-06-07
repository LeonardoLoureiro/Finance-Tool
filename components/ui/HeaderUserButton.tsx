'use client';

import { UserButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';

export function HeaderUserButton() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return null;
  }

  return <UserButton />;
}
