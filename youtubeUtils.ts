
import { YouTubeChannel, YouTubeVideo, MonetizationAnalysis, RevenueProjection } from './types';

export const CATEGORY_MAP: Record<string, string> = {
  "1": "Film & Animation",
  "2": "Autos & Vehicles",
  "10": "Music",
  "15": "Pets & Animals",
  "17": "Sports",
  "18": "Short Movies",
  "19": "Travel & Events",
  "20": "Gaming",
  "21": "Videoblogging",
  "22": "People & Blogs",
  "23": "Comedy",
  "24": "Entertainment",
  "25": "News & Politics",
  "26": "Howto & Style",
  "27": "Education",
  "28": "Science & Technology",
  "29": "Nonprofits & Activism",
  "30": "Movies",
  "31": "Anime/Animation",
  "32": "Action/Adventure",
  "33": "Classics",
  "34": "Comedy",
  "35": "Documentary",
  "36": "Drama",
  "37": "Family",
  "38": "Foreign",
  "39": "Horror",
  "40": "Sci-Fi/Fantasy",
  "41": "Thriller",
  "42": "Shorts",
  "43": "Shows",
  "44": "Trailers"
};

export const CATEGORY_CPM_DATA: Record<string, { cpm: number, rpm: number }> = {
  "Science & Technology": { cpm: 20.80, rpm: 11.44 },
  "Finance & Business": { cpm: 22.50, rpm: 13.20 },
  "Autos & Vehicles": { cpm: 18.00, rpm: 9.90 },
  "Education": { cpm: 14.20, rpm: 7.81 },
  "Howto & Style": { cpm: 13.30, rpm: 7.32 },
  "Entertainment": { cpm: 12.50, rpm: 6.88 },
  "Gaming": { cpm: 9.20, rpm: 5.06 },
  "People & Blogs": { cpm: 10.00, rpm: 5.50 },
  "Travel & Events": { cpm: 18.70, rpm: 10.29 },
  "Music": { cpm: 4.50, rpm: 2.40 },
  "Comedy": { cpm: 8.50, rpm: 4.60 },
  "News & Politics": { cpm: 7.80, rpm: 4.20 },
  "Sports": { cpm: 11.00, rpm: 6.00 },
  "Pets & Animals": { cpm: 6.50, rpm: 3.50 },
  "Film & Animation": { cpm: 12.00, rpm: 6.60 },
  "Nonprofits & Activism": { cpm: 5.00, rpm: 2.75 }
};

export const extractChannelInfo = (url: string): { type: 'id' | 'username' | 'handle' | 'video', value: string } | null => {
  const cleanUrl = url.trim();
  // Updated Regex to include 'shorts' in the non-capturing group
  const videoMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (videoMatch) return { type: 'video', value: videoMatch[1] };

  const handleMatch = cleanUrl.match(/(?:www\.)?youtube\.com\/(@[a-zA-Z0-9._-]+)/);
  if (handleMatch) return { type: 'handle', value: handleMatch[1] };

  const idMatch = cleanUrl.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/);
  if (idMatch) return { type: 'id', value: idMatch[1] };

  const userMatch = cleanUrl.match(/youtube\.com\/user\/([a-zA-Z0-9_-]+)/);
  if (userMatch) return { type: 'username', value: userMatch[1] };

  const cMatch = cleanUrl.match(/youtube\.com\/c\/([a-zA-Z0-9_-]+)/);
  if (cMatch) return { type: 'username', value: cMatch[1] };

  if (cleanUrl.startsWith('@')) return { type: 'handle', value: cleanUrl };
  return null;
};

export const analyzeMonetization = (channel: YouTubeChannel, video?: YouTubeVideo | null): MonetizationAnalysis & { earnings: RevenueProjection, activeRPM: number } => {
  const stats = channel.statistics;
  const publishedDate = new Date(channel.snippet.publishedAt);
  const now = new Date();
  const ageInDays = Math.max(1, (now.getTime() - publishedDate.getTime()) / (1000 * 3600 * 24));

  const subCount = parseInt(stats.subscriberCount || '0');
  const vidCount = parseInt(stats.videoCount || '0');
  const viewCount = parseInt(stats.viewCount || '0');

  const subscriberCheck = subCount >= 1000;
  const ageCheck = ageInDays >= 180;
  const contentCheck = vidCount >= 10;
  const viewsCheck = viewCount >= 10000;

  let score = 0;
  if (subscriberCheck) score += 40;
  if (ageCheck) score += 20;
  if (contentCheck) score += 20;
  if (viewsCheck) score += 20;

  // --- Real Data Calculation ---
  // Detect Category to set specific RPM
  let activeRPM = 4.00; // Global Average Fallback

  if (video && video.snippet.categoryId) {
    const catId = video.snippet.categoryId;
    const catName = CATEGORY_MAP[catId];
    if (catName && CATEGORY_CPM_DATA[catName]) {
      activeRPM = CATEGORY_CPM_DATA[catName].rpm;
    }
  } else {
    // Attempt to guess from channel keywords if video not provided
    const keywords = (channel.brandingSettings?.channel?.keywords || "") + " " + channel.snippet.title;
    const lowerKeywords = keywords.toLowerCase();

    for (const [catName, data] of Object.entries(CATEGORY_CPM_DATA)) {
      if (lowerKeywords.includes(catName.toLowerCase().split(' ')[0])) {
        activeRPM = data.rpm;
        break;
      }
    }
  }

  const monthsActive = ageInDays / 30.44;
  const avgMonthlyViews = viewCount / Math.max(1, monthsActive);

  // Calculate using the Specific RPM (API-Driven)
  const monthlyEst = (avgMonthlyViews / 1000) * activeRPM;

  // Create variance for estimation range
  const monthlyMin = monthlyEst * 0.8;
  const monthlyMax = monthlyEst * 1.2;

  return {
    isLikelyMonetized: score >= 70,
    score,
    details: {
      subscriberCheck,
      ageCheck,
      contentCheck,
      viewsCheck
    },
    activeRPM, // Return for display
    earnings: {
      daily: { min: monthlyMin / 30.44, max: monthlyMax / 30.44 },
      weekly: { min: (monthlyMin / 30.44) * 7, max: (monthlyMax / 30.44) * 7 },
      monthly: { min: monthlyMin, max: monthlyMax },
      yearly: { min: monthlyMin * 12, max: monthlyMax * 12 }
    }
  };
};

export const formatNumber = (num: string | number): string => {
  const n = typeof num === 'string' ? parseInt(num) : num;
  if (isNaN(n)) return '0';
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};
