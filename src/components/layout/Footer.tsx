import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-card-border mt-8 py-10 text-center text-muted">
      <div className="w-full max-w-[1120px] mx-auto px-4">
        <nav className="flex justify-center gap-6 flex-wrap mb-3">
          {[
            { label: 'Projects', href: '/#projects' },
            { label: 'About', href: '/#about' },
            { label: 'Vitae', href: '/#vitae' },
            { label: 'Blog', to: '/blog' },
            { label: 'Contact', href: '/#contact' },
          ].map(l => (
            l.to
              ? <Link key={l.label} to={l.to} className="text-muted font-bold text-sm no-underline hover:text-ink hover:no-underline">{l.label}</Link>
              : <a key={l.label} href={l.href} className="text-muted font-bold text-sm no-underline hover:text-ink hover:no-underline">{l.label}</a>
          ))}
        </nav>
        <div className="flex justify-center gap-5 mb-3">
          {[
            { label: 'GitHub', href: 'https://github.com/erogluegemen' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/egemeneroglu' },
            { label: 'Scholar', href: 'https://scholar.google.com/citations?user=_MF_RW8AAAAJ&hl=tr' },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener" className="text-dhl-red font-bold text-sm no-underline hover:underline">{l.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
