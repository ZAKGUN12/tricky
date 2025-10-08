import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MobileNav() {
  const router = useRouter();

  const navItems = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/submit', icon: '✨', label: 'Share' },
    { href: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => (
        <Link 
          key={item.href} 
          href={item.href} 
          className={`nav-item ${router.pathname === item.href ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}

      <style jsx>{`
        .mobile-nav {
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          background: #111 !important;
          border-top: 1px solid #333 !important;
          display: flex !important;
          justify-content: space-around !important;
          padding: 8px 0 calc(8px + env(safe-area-inset-bottom)) !important;
          z-index: 1000 !important;
          margin: 0 !important;
        }

        .nav-item {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 4px !important;
          padding: 8px 16px !important;
          text-decoration: none !important;
          color: #666 !important;
          transition: all 0.2s !important;
          border-radius: 12px !important;
          min-width: 60px !important;
          margin: 0 !important;
        }

        .nav-item:hover,
        .nav-item.active {
          color: #00d4aa !important;
          background: rgba(0, 212, 170, 0.1) !important;
        }

        .nav-icon {
          font-size: 20px !important;
          margin: 0 !important;
        }

        .nav-label {
          font-size: 12px !important;
          font-weight: 600 !important;
          margin: 0 !important;
        }

        @media (min-width: 768px) {
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
