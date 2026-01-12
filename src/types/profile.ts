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
  followers_count: number;
  start_price: number | null;
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
  email?: string; // Added email for client profiles
  contact_email?: string;
  phone?: string;
  address?: string;
  booking_url?: string;
}