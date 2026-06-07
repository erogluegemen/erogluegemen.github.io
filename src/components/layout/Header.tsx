import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Projects', href: '/#projects' },
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Blog', to: '/blog' },
  { label: '🍾 Liquid Assets', to: '/collection' },
];

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const linkCls = (isActive: boolean) => cn(
    'px-2.5 py-1.5 rounded-lg font-bold text-sm no-underline hover:no-underline transition-colors hover:bg-dhl-yellow/30 text-ink',
    isActive && 'text-dhl-red'
  );

  const mobileLinkCls = (isActive: boolean) => cn(
    'block w-full px-3 py-2.5 rounded-xl font-bold text-sm no-underline hover:no-underline transition-colors hover:bg-dhl-yellow/30 text-ink',
    isActive && 'text-dhl-red bg-dhl-yellow/10'
  );

  return (
    <header
      className="sticky top-0 z-30 border-b border-card-border"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)' }}
    >
      <div className="w-full max-w-[1120px] mx-auto px-4 flex items-center justify-between py-3">

        <div className="flex items-center gap-3">
          <Link to="/" className="font-black text-ink no-underline hover:no-underline text-base">
            Egemen Eroglu
          </Link>
          <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-card-border bg-card text-xs font-bold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dhl-red opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-dhl-red" />
            </span>
            R&D Specialist @ DHL Express
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-0.5 list-none m-0 p-0">
            {NAV_LINKS.map(link => {
              const isActive = link.to ? location.pathname === link.to : false;
              return (
                <li key={link.label}>
                  {link.to
                    ? <Link to={link.to} className={linkCls(isActive)}>{link.label}</Link>
                    : <a href={link.href} className={linkCls(false)}>{link.label}</a>
                  }
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 cursor-pointer p-1"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="block h-0.5 w-full bg-ink rounded-full origin-center"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.15 }}
            className="block h-0.5 w-full bg-ink rounded-full"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="block h-0.5 w-full bg-ink rounded-full origin-center"
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="md:hidden overflow-hidden border-t border-card-border"
          >
            <ul className="flex flex-col list-none m-0 p-3 gap-1">
              {NAV_LINKS.map(link => {
                const isActive = link.to ? location.pathname === link.to : false;
                return (
                  <li key={link.label}>
                    {link.to
                      ? <Link to={link.to} className={mobileLinkCls(isActive)}>{link.label}</Link>
                      : <a href={link.href} className={mobileLinkCls(false)}>{link.label}</a>
                    }
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
