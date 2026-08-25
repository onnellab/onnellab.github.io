export type ExtendedBlogPost = {
  slug: string;
  title: string;
  description: string;
  category: 'music' | 'media' | 'reading' | 'productivity';
  relatedApps: string[];
  publishedAt: string;
  updatedAt: string;
  body: string;
};
