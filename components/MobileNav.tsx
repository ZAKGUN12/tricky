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
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #111;
          border-top: 1px solid #333;
          display: flex;
          justify-content: space-around;
          padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
          z-index: 100;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          text-decoration: none;
          color: #666;
          transition: all 0.2s;
          border-radius: 12px;
          min-width: 60px;
        }

        .nav-item:hover,
        .nav-item.active {
          color: #00d4aa;
          background: rgba(0, 212, 170, 0.1);
        }

        .nav-icon {
          font-size: 20px;
        }

        .nav-label {
          font-size: 12px;
          font-weight: 600;
        }

        @media (min-width: 768px) {
          .mobile-nav {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
