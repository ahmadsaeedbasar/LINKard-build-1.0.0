export interface Profile {
  id: string;
  name: string;
  platform: 'youtube' | 'twitter' | 'threads' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok' | 'other';
  platformLabel: string;
  platformColorClass: string;
  profileImage: string;
  isVerified: boolean;
  category: string;
  location: string;
  followers: string;
  startPrice: string;
  availableSpaces: string[];
  profileLink: string;
  socialLink: string;
  contentType: string;
}

export const featuredProfiles: Profile[] = [
  {
    id: 'koRETmv7a2FyVFVnTkG7hT',
    name: 'Talha Khalid',
    platform: 'youtube',
    platformLabel: 'YouTube',
    platformColorClass: 'bg-red-600',
    profileImage: '/media/Social Account/Login.png',
    isVerified: true,
    category: 'Travel',
    location: 'Benin',
    followers: '17.0k',
    startPrice: '$1.2k',
    availableSpaces: ['Video', 'Shorts', 'Community_Post', 'Bio_Link', 'Live_Stream'],
    profileLink: '@talha',
    socialLink: 'https://www.youtube.com/talha_khalid',
    contentType: 'Personal Presence',
  },
  {
    id: 'Nb3hwDpT9JbMqD9qi4vAgw',
    name: 'Talha Khalid',
    platform: 'twitter',
    platformLabel: 'X / Twitter',
    platformColorClass: 'bg-black',
    profileImage: '/media/Social Account/Screenshot_From_2025-12-20_12-08-06.png',
    isVerified: true,
    category: 'Technology',
    location: 'Bahrain',
    followers: '21.0k',
    startPrice: '$350',
    availableSpaces: ['Post', 'Thread', 'Retweet', 'Bio_Link', 'Pinned_Post'],
    profileLink: '@talha',
    socialLink: 'https://www.instagram.com/talha_khallid',
    contentType: 'Personal Presence',
  },
  {
    id: 'WjJVFGFqwtuk8hZFKU8bRt',
    name: 'Talha K.',
    platform: 'threads',
    platformLabel: 'Threads',
    platformColorClass: 'bg-gray-600',
    profileImage: '/media/Social Account/2JTUIUpS_400x400_sDPUJGd.jpg',
    isVerified: false,
    category: 'Sports',
    location: 'United States',
    followers: '2.0k',
    startPrice: '$50',
    availableSpaces: ['Post', 'Bio_Link'],
    profileLink: '@talha',
    socialLink: 'https://www.x.com/talha_khalid',
    contentType: 'Personal Presence',
  },
  {
    id: '25mbLEn5FioAjEa2wXHNB8',
    name: 'Talha Khalid',
    platform: 'linkedin',
    platformLabel: 'LinkedIn',
    platformColorClass: 'bg-blue-700',
    profileImage: '/media/Social Account/2JTUIUpS_400x400_RJvoIN3.jpg',
    isVerified: true,
    category: 'Music',
    location: 'Belgium',
    followers: '30.0k',
    startPrice: '$350',
    availableSpaces: ['Post', 'Article', 'Bio_Link', 'Repost', 'Newsletter_Feature'],
    profileLink: '@talha',
    socialLink: 'https://www.linkedin.com/talha_khallid',
    contentType: 'Personal Presence',
  },
  {
    id: 'HdUoqLgNW8yKCdKyCuGUre',
    name: 'Talha K.',
    platform: 'instagram',
    platformLabel: 'Instagram',
    platformColorClass: 'bg-pink-600',
    profileImage: '/media/Social Account/2JTUIUpS_400x400_pWUSKq3.jpg',
    isVerified: true,
    category: 'Lifestyle',
    location: 'Belgium',
    followers: '12.0k',
    startPrice: '$300',
    availableSpaces: ['Story', 'Post', 'Reel', 'Bio_Link'],
    profileLink: '@talha',
    socialLink: 'https://www.instagram.com/talha_khalid',
    contentType: 'Personal Presence',
  },
  {
    id: 'SpttwkQKVRuW5E2Ehhkn3p',
    name: 'Mohsin X.',
    platform: 'threads',
    platformLabel: 'Threads',
    platformColorClass: 'bg-gray-600',
    profileImage: '/media/Social Account/Frame_7.png',
    isVerified: true,
    category: 'Gaming',
    location: 'Afghanistan',
    followers: '23.0k',
    startPrice: '$500',
    availableSpaces: ['Post', 'Repost', 'Bio_Link', 'Custom'],
    profileLink: '@mohsin',
    socialLink: 'https://www.threads.com/@mohsin',
    contentType: 'Content-First',
  },
  {
    id: '3WissMc2nR6Fk4oQZUHjHy',
    name: 'D. Jogs',
    platform: 'youtube',
    platformLabel: 'YouTube',
    platformColorClass: 'bg-red-600',
    profileImage: '/media/Social Account/G3_7Jq4XsAASD98.jpeg',
    isVerified: true,
    category: 'Gaming',
    location: 'United States',
    followers: '450.0k',
    startPrice: '$10.0k',
    availableSpaces: ['Video', 'Shorts', 'Community_Post', 'Bio_Link', 'Live_Stream', 'Custom'],
    profileLink: '@mohsin',
    socialLink: 'https://www.youtube.com/mohsin',
    contentType: 'Content-First',
  },
];