'use client';

import { FileProvider } from '@/contexts/FileContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <FileProvider>{children}</FileProvider>;
}
