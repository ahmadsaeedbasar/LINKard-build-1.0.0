export interface PortfolioItem {
  title: string;
  type: 'video' | 'image';
  thumbnail: string;
  url: string;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  role: string;
  category: string;
  location: string;
  followers_count: string;
  start_price: string | null; // Changed to allow null
  platform: string;
  platform_label: string;
  platform_color_class: string;
  avatar_url: string;
  is_verified: boolean;
  is_featured: boolean;
  bio: string;
  available_spaces: string[];
  social_link?: string;
  portfolio_items?: PortfolioItem[];
  created_at?: string;
  updated_at?: string;
}