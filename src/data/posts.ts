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
    slug: 'kl-divergence-explained',
    title: 'KL Divergence Explained',
    date: '5 July 2026',
    readTime: '5 min read',
    tags: ['technical'],
    excerpt: "Entropy, KL divergence, and why forward vs reverse KL determines whether a model collapses onto one mode or spreads across all of them. First post in a series building up to the ELBO.",
  },
];
