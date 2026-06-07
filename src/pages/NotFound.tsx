import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  useEffect(() => { document.title = '404 — Egemen Eroglu'; }, []);
  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22 }}
      >
        <div className="text-6xl mb-4">📦</div>
        <h1 className="text-2xl font-black mb-3">Page not found</h1>
        <p className="text-muted mb-6">Looks like this shipment got lost in transit.</p>
        <Link to="/" className="inline-flex items-center justify-center rounded-xl font-black border-2 bg-dhl-yellow text-ink border-ink shadow-md px-5 py-2.5 no-underline hover:no-underline hover:-translate-y-0.5 transition-transform">
          ← Back home
        </Link>
      </motion.div>
    </div>
  );
}
