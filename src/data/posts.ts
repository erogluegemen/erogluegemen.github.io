export interface Post {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
}

export const posts: Post[] = [
  {
    slug: 'shipping-ml-to-production',
    title: 'What nobody tells you about shipping ML to production',
    date: '28 April 2026',
    readTime: '2 min read',
    tags: ['technical'],
    excerpt: 'The gap between a model that works on your laptop and one that runs reliably in a live logistics system is wider than most people expect.',
  },
];
