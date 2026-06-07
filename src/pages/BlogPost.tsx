import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { posts } from '@/data/posts';
import { cn } from '@/lib/utils';

const markdownFiles = import.meta.glob('../data/posts/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.slug === slug);
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!slug) return;
    const loader = markdownFiles[`../data/posts/${slug}.md`];
    if (loader) loader().then(setContent);
  }, [slug]);

  useEffect(() => {
    if (post) document.title = `${post.title} — Egemen Eroglu`;
  }, [post]);

  if (!post) {
    return (
      <div className="w-full max-w-[1120px] mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black mb-3">Post not found</h1>
        <Link to="/blog" className="font-bold text-dhl-red">← Back to Blog</Link>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 pb-20">
      <div className="max-w-[680px] mx-auto pt-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 22 }}>
          <Link to="/blog" className="inline-block mb-8 font-bold text-sm text-dhl-red no-underline hover:underline">
            ← Back to Blog
          </Link>

          <div className="mb-6">
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
            <h1 className="text-[clamp(1.6rem,3vw,2rem)] font-black leading-tight mb-0">
              {post.title}
            </h1>
          </div>

          <hr className="border-card-border mb-8" />

          <div className="prose prose-base max-w-none leading-[1.75]
            [&_p]:mb-5 [&_p]:text-ink/90
            [&_h2]:text-lg [&_h2]:font-black [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-ink
            [&_h3]:text-base [&_h3]:font-black [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-ink
            [&_ul]:mb-5 [&_ul]:pl-5 [&_ul]:list-disc
            [&_ol]:mb-5 [&_ol]:pl-5 [&_ol]:list-decimal
            [&_li]:mb-1
            [&_code]:bg-dhl-yellow/20 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
            [&_pre]:bg-ink [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:mb-5
            [&_blockquote]:border-l-4 [&_blockquote]:border-dhl-yellow [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted [&_blockquote]:mb-5
            [&_a]:text-dhl-red [&_a]:font-bold [&_a]:underline
            [&_strong]:font-black [&_strong]:text-ink">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          <div className="flex gap-3 flex-wrap mt-8 pt-6 border-t border-card-border">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-card-border bg-card font-bold text-sm text-ink no-underline hover:border-dhl-yellow transition-colors"
            >
              🔗 Share on LinkedIn
            </a>
            <button
              onClick={copyLink}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 bg-card font-bold text-sm cursor-pointer transition-colors',
                copied ? 'border-green-400 text-green-700' : 'border-card-border text-ink hover:border-dhl-yellow'
              )}
            >
              {copied ? '✅ Copied!' : '📋 Copy link'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
