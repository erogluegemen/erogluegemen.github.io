export interface Post {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  coverImage: string;
}

export const posts: Post[] = [
  {
    slug: 'mle-to-elbo',
    title: '[2] From Maximum Likelihood Estimation (MLE) to Evidence Lower Bound (ELBO): Why Exact Posteriors Are Intractable',
    date: '25 July 2026',
    readTime: '4 min read',
    tags: ['technical'],
    excerpt: "Why training a latent-variable generative model needs a posterior that has no closed form — and how the ELBO sidesteps it by rewriting the objective in terms that are actually tractable. Second post in the Generative Models series.",
    coverImage: '/assets/images/mle-elbo-fig1.gif',
  },
  {
    slug: 'kl-divergence-explained',
    title: '[1] KL Divergence Explained',
    date: '5 July 2026',
    readTime: '5 min read',
    tags: ['technical'],
    excerpt: "Entropy, KL divergence, and why forward vs reverse KL determines whether a model collapses onto one mode or spreads across all of them. First post in a series building up to the ELBO.",
    coverImage: '/assets/images/kl-divergence-entropy-formula.png',
  },
];
