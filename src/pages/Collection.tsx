import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import bottlesRaw from '@/data/bottles.json';
import { cn } from '@/lib/utils';
import { canonicalUrl } from '@/lib/seo';

interface Bottle {
  name: string;
  country: string;
  flag: string;
  type: string;
  opened: boolean;
  image: string;
}

const bottles = bottlesRaw as Bottle[];
const ALL_TYPES = Array.from(new Set(bottles.map(b => b.type))).sort();
const ALL_COUNTRIES = Array.from(new Set(bottles.map(b => b.country))).sort();

type StatusFilter = 'all' | 'sealed' | 'opened';

export default function Collection() {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Bottle | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selected]);

  const activeFilterCount = [activeType, activeCountry, activeStatus !== 'all' ? activeStatus : null].filter(Boolean).length;

  const filtered = useMemo(() => {
    return bottles.filter(b => {
      const matchesQuery = !query || b.name.toLowerCase().includes(query.toLowerCase()) || b.country.toLowerCase().includes(query.toLowerCase());
      const matchesType = !activeType || b.type === activeType;
      const matchesCountry = !activeCountry || b.country === activeCountry;
      const matchesStatus = activeStatus === 'all' || (activeStatus === 'sealed' ? !b.opened : b.opened);
      return matchesQuery && matchesType && matchesCountry && matchesStatus;
    });
  }, [query, activeType, activeCountry, activeStatus]);

  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 pb-20">
      <Helmet>
        <title>Liquid Assets — Egemen Eroglu</title>
        <meta name="description" content="Miniature alcohol bottles collected from around the world — a personal collection with origin stories." />
        <link rel="canonical" href={canonicalUrl('/collection')} />
        <meta property="og:url" content={canonicalUrl('/collection')} />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22 }}
        className="pt-12 pb-6"
      >
        <h1 className="mb-2">Liquid Assets</h1>
        <p className="text-muted">
          Miniature alcohol bottles I've collected from around the world. Each one is a little souvenir with a story.
        </p>

        <div className="mt-4 max-w-[480px]">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search bottles..."
            autoComplete="off"
            aria-label="Search bottles"
            className="w-full px-4 py-2.5 rounded-xl border-2 border-card-border bg-card font-semibold text-sm text-ink placeholder:text-muted shadow-sm outline-none focus:border-dhl-yellow transition-colors"
          />
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-card-border bg-card font-bold text-xs cursor-pointer hover:border-dhl-yellow transition-colors"
            >
              <span>{filtersOpen ? '▲' : '▼'}</span>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-dhl-yellow text-ink rounded-full px-1.5 py-0.5 text-[10px] font-black">{activeFilterCount}</span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setActiveType(null); setActiveCountry(null); setActiveStatus('all'); }}
                className="text-xs font-bold text-muted hover:text-dhl-red transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="mt-3 space-y-4 overflow-hidden"
            >
              {/* Status */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-muted mb-1.5">Status</p>
                <div className="flex gap-2">
                  {(['all', 'sealed', 'opened'] as StatusFilter[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setActiveStatus(s)}
                      className={cn(
                        'px-3 py-1 rounded-full border font-bold text-xs cursor-pointer transition-colors capitalize',
                        activeStatus === s ? 'bg-dhl-yellow border-dhl-yellow text-ink' : 'bg-card border-card-border text-ink hover:border-dhl-yellow'
                      )}
                    >
                      {s === 'sealed' ? '🔒 Sealed' : s === 'opened' ? 'Opened' : 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-muted mb-1.5">Type</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveType(null)}
                    className={cn(
                      'px-3 py-1 rounded-full border font-bold text-xs cursor-pointer transition-colors',
                      activeType === null ? 'bg-dhl-yellow border-dhl-yellow text-ink' : 'bg-card border-card-border text-ink hover:border-dhl-yellow'
                    )}
                  >
                    All
                  </button>
                  {ALL_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setActiveType(activeType === type ? null : type)}
                      className={cn(
                        'px-3 py-1 rounded-full border font-bold text-xs cursor-pointer transition-colors',
                        activeType === type ? 'bg-dhl-yellow border-dhl-yellow text-ink' : 'bg-card border-card-border text-ink hover:border-dhl-yellow'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-muted mb-1.5">Country</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveCountry(null)}
                    className={cn(
                      'px-3 py-1 rounded-full border font-bold text-xs cursor-pointer transition-colors',
                      activeCountry === null ? 'bg-dhl-yellow border-dhl-yellow text-ink' : 'bg-card border-card-border text-ink hover:border-dhl-yellow'
                    )}
                  >
                    All
                  </button>
                  {ALL_COUNTRIES.map(country => (
                    <button
                      key={country}
                      onClick={() => setActiveCountry(activeCountry === country ? null : country)}
                      className={cn(
                        'px-3 py-1 rounded-full border font-bold text-xs cursor-pointer transition-colors',
                        activeCountry === country ? 'bg-dhl-yellow border-dhl-yellow text-ink' : 'bg-card border-card-border text-ink hover:border-dhl-yellow'
                      )}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <p className="text-sm font-semibold text-muted mt-2">
          {filtered.length} bottle{filtered.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg font-bold">🔍 No bottles found for "{query}"</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
          {filtered.map((bottle, i) => (
            <motion.div
              key={bottle.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', damping: 22, delay: Math.min(i * 0.03, 0.3) }}
              whileHover={{ y: -3, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              onClick={() => setSelected(bottle)}
              className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-md cursor-pointer"
            >
              <div
                className="h-[180px] flex items-center justify-center border-b border-card-border"
                style={{ background: 'color-mix(in srgb, #FFCC00 6%, white)' }}
              >
                <img
                  src={`/${bottle.image}`}
                  alt={bottle.name}
                  className="max-h-[160px] max-w-[80%] object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-3.5">
                <p className="font-black text-base leading-tight mb-1 overflow-wrap-anywhere">{bottle.name}</p>
                <p className="text-xs font-semibold text-muted mb-2">
                  {bottle.flag} {bottle.country}
                </p>
                <div className="flex flex-col gap-1">
                  <span className="inline-block text-[10px] font-bold bg-dhl-yellow/25 border border-dhl-yellow/50 px-2 py-0.5 rounded-full self-start whitespace-nowrap">
                    {bottle.type}
                  </span>
                  <span className={cn(
                    'inline-block text-[10px] font-bold px-2 py-0.5 rounded-full self-start whitespace-nowrap',
                    bottle.opened
                      ? 'bg-muted/10 border border-muted/30 text-muted'
                      : 'bg-green-50 border border-green-300/60 text-green-700'
                  )}>
                    {bottle.opened ? 'Opened' : '🔒 Sealed'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-3xl shadow-2xl border border-card-border max-w-sm w-full overflow-hidden"
            >
              <div
                className="flex items-center justify-center p-8 border-b border-card-border"
                style={{ background: 'color-mix(in srgb, #FFCC00 8%, white)' }}
              >
                <img
                  src={`/${selected.image}`}
                  alt={selected.name}
                  className="max-h-[280px] max-w-[70%] object-contain drop-shadow-lg"
                />
              </div>
              <div className="p-6">
                <p className="font-black text-xl leading-tight mb-1">{selected.name}</p>
                <p className="text-sm font-semibold text-muted mb-4">
                  {selected.flag} {selected.country}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-xs font-bold bg-dhl-yellow/25 border border-dhl-yellow/50 px-2.5 py-1 rounded-full">
                    {selected.type}
                  </span>
                  <span className={cn(
                    'text-xs font-bold px-2.5 py-1 rounded-full',
                    selected.opened
                      ? 'bg-muted/10 border border-muted/30 text-muted'
                      : 'bg-green-50 border border-green-300/60 text-green-700'
                  )}>
                    {selected.opened ? 'Opened' : '🔒 Sealed'}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-full py-2.5 rounded-xl border-2 border-ink bg-dhl-yellow font-black text-sm cursor-pointer hover:-translate-y-0.5 transition-transform"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
