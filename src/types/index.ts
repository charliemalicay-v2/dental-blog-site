export interface Source {
  title: string;
  url: string;
  publisher: string;
  year: number;
}

export interface ClinicalReview {
  reviewer: string;
  reviewedAt: string;
  credentials: string;
}

export interface HeroImage {
  src: string;
  alt: string;
  credit?: string;
}

export interface PracticeLink {
  servicePageUrl: string;
  anchorText: string;
}

export interface Post {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string; // author slug
  category: string; // category slug
  tags: string[];
  heroImage: HeroImage;
  clinicalReview: ClinicalReview;
  sources: Source[];
  relatedToPractice: PracticeLink;
  draft: boolean;
  /** Rendered MDX body */
  content: React.ReactNode;
}

export interface PostFrontmatter {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  category: string;
  tags: string[];
  heroImage: HeroImage;
  clinicalReview: ClinicalReview;
  sources: Source[];
  relatedToPractice: PracticeLink;
  draft?: boolean;
}

export interface Author {
  name: string;
  slug: string;
  credentials: string;
  role: string;
  bio: string;
  headshot: string;
  licenseInfo?: string;
  practiceUrl: string;
  sameAs: string[];
}

export interface Category {
  name: string;
  slug: string;
  description: string;
}
