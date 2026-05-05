'use client';

import { MessageCircle } from 'lucide-react';
import { useUI } from '@/lib/store';

export function WhatsAppButton() {
  const { locale } = useUI();
  return (
    <a
      href="https://wa.me/201010254819"
      target="_blank"
      rel="noopener noreferrer"
      title={locale === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
      className="fixed bottom-5 end-5 z-30 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute -top-1 -end-1 w-3.5 h-3.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
    </a>
  );
}
