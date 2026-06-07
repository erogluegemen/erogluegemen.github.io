import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { posts } from '@/data/posts';
import { cn } from '@/lib/utils';

export default function BlogList() {
  useEffect(() => { document.title = 'Blog — Egemen Eroglu'; }, []);

  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22 }}
        className="pt-12 pb-8"
      >
        <h1 className="mb-2">Blog</h1>
        <p className="text-muted">Short notes, stray thoughts, and the occasional technical write-up.</p>
      </motion.div>

      <div className="flex flex-col gap-4 max-w-[720px]">
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, delay: 0.08 * i }}
            whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="block bg-card border border-card-border rounded-2xl p-6 shadow-md no-underline hover:no-underline text-ink hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className={cn(
                      'text-xs font-bold px-2 py-0.5 rounded-full border',
                      tag === 'technical'
                        ? 'bg-dhl-red/10 border-dhl-red/30 text-dhl-red'
                        : 'bg-dhl-yellow/20 border-dhl-yellow/50 text-ink'
                    )}
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-sm font-semibold text-muted">{post.date}</span>
                <span className="text-sm text-muted">· {post.readTime}</span>
              </div>
              <p className="text-xl font-black leading-tight mb-2">{post.title}</p>
              <p className="text-sm text-muted mb-3">{post.excerpt}</p>
              <span className="text-sm font-bold text-dhl-red">Read →</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
