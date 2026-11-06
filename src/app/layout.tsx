import type { Metadata } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import { getStoreName } from '@/lib/env';
import './globals.css';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const storeName = getStoreName();

export const metadata: Metadata = {
  title: `${storeName} · Catálogo`,
  description: 'Catálogo simple con pedidos por WhatsApp',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" className={`${syne.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
