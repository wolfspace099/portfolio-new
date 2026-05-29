'use client';

import { useRouter } from 'next/navigation';
import TosPopup from '@/app/components/modals/TosPopup';

export default function TosPage() {
  const router = useRouter();
  return <TosPopup onClose={() => router.push('/')} />;
}
