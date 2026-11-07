import Link from 'next/link';
import { getStoreName } from '@/lib/env';

type SiteHeaderProps = {
  showAdminLink?: boolean;
  whatsappNumber?: string;
};

export function SiteHeader({
  showAdminLink = false,
  whatsappNumber = '',
}: SiteHeaderProps) {
  const storeName = getStoreName();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          {storeName}
        </Link>
        <nav className="site-header__nav">
          {whatsappNumber ? (
            <a
              className="text-link"
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          ) : null}
          {showAdminLink ? (
            <Link href="/admin" className="text-link">
              Admin
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
