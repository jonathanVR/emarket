import Link from 'next/link';
import { getStoreName, getWhatsAppNumber } from '@/lib/env';

type SiteHeaderProps = {
  showAdminLink?: boolean;
};

export function SiteHeader({ showAdminLink = false }: SiteHeaderProps) {
  const storeName = getStoreName();
  const phone = getWhatsAppNumber();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          {storeName}
        </Link>
        <nav className="site-header__nav">
          {phone ? (
            <a
              className="text-link"
              href={`https://wa.me/${phone}`}
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
