
export interface ChannelStats {
  viewCount: string;
  subscriberCount: string;
  videoCount: string;
  hiddenSubscriberCount: boolean;
}

export interface ChannelSnippet {
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  customUrl?: string;
  country?: string;
}

export interface BrandingSettings {
  channel?: {
    title?: string;
    description?: string;
    keywords?: string;
    country?: string;
  };
  image?: {
    bannerExternalUrl?: string;
  };
}

export interface ChannelStatus {
  madeForKids?: boolean;
  selfDeclaredMadeForKids?: boolean;
  privacyStatus?: string;
}

export interface YouTubeChannel {
  id: string;
  snippet: ChannelSnippet;
  statistics: ChannelStats;
  brandingSettings?: BrandingSettings;
  status?: ChannelStatus;
}

export interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      high: { url: string };
      medium: { url: string };
    };
    channelId: string;
    channelTitle: string;
    tags?: string[];
    categoryId: string;
    liveBroadcastContent?: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  contentDetails?: {
    duration: string;
    definition: string;
    licensedContent: boolean;
    regionRestriction?: {
      allowed?: string[];
      blocked?: string[];
    };
  };
  status?: {
    privacyStatus: string;
    publishAt?: string;
    license?: string;
    embeddable?: boolean;
    publicStatsViewable?: boolean;
  };
}

export interface YouTubePlaylist {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    thumbnails: {
      medium: { url: string };
    };
  };
  contentDetails: {
    itemCount: number;
  };
  status?: {
    privacyStatus: string;
  };
}

export interface YouTubeCaption {
  id: string;
  snippet: {
    videoId: string;
    lastUpdated: string;
    trackKind: string;
    language: string;
    name: string;
    isDraft: boolean;
    isAutoSynced: boolean;
  };
}

export interface YouTubeSection {
  id: string;
  snippet: {
    type: string;
    style: string;
    title?: string;
    position?: number;
  };
}

// --- New Interfaces for Features ---

export interface YouTubeSubscription {
  id: string;
  snippet: {
    title: string;
    description: string;
    resourceId: {
      channelId: string;
    };
    thumbnails: {
      medium: { url: string };
    };
  };
}

export interface YouTubeComment {
  id: string;
  snippet: {
    textDisplay: string;
    authorDisplayName: string;
    authorProfileImageUrl: string;
    likeCount: number;
    publishedAt: string;
    parentId?: string;
  };
}

export interface YouTubeCommentThread {
  id: string;
  snippet: {
    videoId: string;
    topLevelComment: YouTubeComment;
    totalReplyCount: number;
    canReply: boolean;
  };
  replies?: {
    comments: YouTubeComment[];
  };
}

export interface YouTubeActivity {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    type: string; // 'subscription', 'like', 'upload', etc.
    thumbnails: {
      default: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
    channelTitle: string;
  };
  contentDetails: {
    subscription?: { resourceId: { channelId: string } };
    upload?: { videoId: string };
    like?: { resourceId: { videoId: string } };
  };
}

// --- Analytics & Reporting Types ---

export interface AnalyticsRow {
  day?: string;
  views?: number;
  estimatedMinutesWatched?: number;
  subscribersGained?: number;
  estimatedRevenue?: number;
  averageViewDuration?: number;
  videoTitle?: string;
  videoId?: string;
  ageGroup?: string;
  gender?: string;
  country?: string;
  viewerPercentage?: number;
}

export interface ReportingJob {
  id: string;
  reportTypeId: string;
  name: string;
  createTime: string;
}

export interface Report {
  id: string;
  jobId: string;
  startTime: string;
  endTime: string;
  downloadUrl: string;
  createTime: string;
}

export interface RevenueRange {
  min: number;
  max: number;
}

export interface RevenueProjection {
  daily: RevenueRange;
  weekly: RevenueRange;
  monthly: RevenueRange;
  yearly: RevenueRange;
}

export interface MonetizationAnalysis {
  isLikelyMonetized: boolean;
  score: number;
  details: {
    subscriberCheck: boolean;
    ageCheck: boolean;
    contentCheck: boolean;
    viewsCheck: boolean;
  };
}

export interface AIAnalysisResult {
  summary: string;
  strategy: string[];
  cpmInsight: string;
}

export interface PolicyAuditResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  violations: string[];
  flaggedContent: {
    text: string;
    location: string;
    reason: string;
  }[];
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedTags: string[];
  policyReasoning: string;
  isPerfect: boolean;
  videoMonetizationStatus: 'ELIGIBLE' | 'RESTRICTED' | 'UNKNOWN';
}

export interface SearchFilters {
  publishedAfter?: string; // Date range (RFC 3339)
  videoDuration?: 'any' | 'short' | 'medium' | 'long';
  videoDefinition?: 'any' | 'high' | 'standard';
  videoLicense?: 'any' | 'creativeCommon' | 'youtube';
  type?: 'video' | 'channel' | 'playlist';
  regionCode?: string;
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';
}

export interface YouTubeCategory {
  id: string;
  snippet: {
    title: string;
    assignable: boolean;
    channelId: string;
  };
}
