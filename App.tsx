
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ToolDetail from './pages/ToolDetail';
import PolicyCheck from './pages/PolicyCheck';
import VideoTranscriber from './pages/VideoTranscriber';
import ThumbnailTester from './pages/ThumbnailTester';
import Disclaimer from './pages/Disclaimer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import MegaSearch from './pages/MegaSearch';
import TrendingDashboard from './pages/TrendingDashboard';
import CategoryExplorer from './pages/CategoryExplorer';
import VideoViewer from './pages/VideoViewer';
import ChannelComparison from './pages/ChannelComparison';
import HashtagGenerator from './pages/HashtagGenerator';
import LiveCounter from './pages/LiveCounter';
import ThumbnailDownloader from './pages/ThumbnailDownloader';
import CommentPicker from './pages/CommentPicker';
import RegionCheck from './pages/RegionCheck';
import TagExtractor from './pages/TagExtractor';
import EmbedGenerator from './pages/EmbedGenerator';
import ThumbnailEditor from './pages/ThumbnailEditor';
import ChannelAudit from './pages/ChannelAudit';
import QRCodeGenerator from './pages/QRCodeGenerator';
import TrendAnalyzer from './pages/TrendAnalyzer';
import SEOOptimizer from './pages/SEOOptimizer';
import VideoIdeasGenerator from './pages/VideoIdeasGenerator';
import AdvancedRevenueCalculator from './pages/AdvancedRevenueCalculator';
import ContentCalendar from './pages/ContentCalendar';
import CompetitorTracker from './pages/CompetitorTracker';
import GrowthPredictor from './pages/GrowthPredictor';
import CPMTracker from './pages/CPMTracker';
import SponsorshipCalculator from './pages/SponsorshipCalculator';
import NotificationTracker from './pages/NotificationTracker';
import AudienceDemographics from './pages/AudienceDemographics';

import { Language } from './translations';
import { getAccessToken, setAccessToken as serviceSetToken, fetchMyChannelProfile, fetchAllMyChannels } from './youtubeService';



interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isDark: boolean;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  userProfile: any | null;
  availableChannels: any[];
  switchChannel: (channelId: string) => void;
  login: () => void;
  manualLogin: (token: string) => void;
  logout: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [isDark, setIsDark] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAccessToken());
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [availableChannels, setAvailableChannels] = useState<any[]>([]);

  // Google Auth Hook
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      serviceSetToken(tokenResponse.access_token);
      setIsAuthenticated(true);

      // Fetch ALL YouTube Channels (including Brand Accounts)
      try {
        const channels = await fetchAllMyChannels();
        setAvailableChannels(channels);

        if (channels.length > 0) {
          // Smart Logic: Automatically select the channel with the MOST subscribers or videos
          // This fixes the issue where a default empty Google Account channel is selected instead of the Brand Account
          const bestChannel = channels.reduce((prev, current) => {
            const prevSubs = parseInt(prev.statistics?.subscriberCount || '0');
            const currSubs = parseInt(current.statistics?.subscriberCount || '0');
            return (prevSubs > currSubs) ? prev : current;
          });

          setUserProfile({
            name: bestChannel.snippet.title,
            picture: bestChannel.snippet.thumbnails.medium.url,
            email: 'YouTube Channel',
            channelId: bestChannel.id,
            subscriberCount: bestChannel.statistics?.subscriberCount || '0',
            viewCount: bestChannel.statistics?.viewCount || '0',
            videoCount: bestChannel.statistics?.videoCount || '0'
          });
        } else {
          console.warn("No channel found, falling back to Google Profile");
          // Fallback to Google Profile if no channel found
          const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
          });
          const data = await userInfo.json();
          setUserProfile(data);
        }
      } catch (e) {
        console.error("Failed to fetch profile", e);
        setUserProfile({ name: 'Creator', picture: '' });
      }
    },
    scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/yt-analytics.readonly',
    onError: () => console.log('Login Failed'),
    flow: 'implicit',
    prompt: 'select_account consent' as any // Forces BOTH account selection and consent checks
  });

  const toggleTheme = () => setIsDark(!isDark);

  // Note: manualLogin is kept for developer testing if needed
  const manualLogin = (token: string) => {
    serviceSetToken(token);
    setIsAuthenticated(true);
    setUserProfile({ name: 'Developer', picture: '' });
  };

  const switchChannel = (channelId: string) => {
    const channel = availableChannels.find(ch => ch.id === channelId);
    if (channel) {
      setUserProfile({
        name: channel.snippet.title,
        picture: channel.snippet.thumbnails.medium.url,
        email: 'YouTube Channel',
        channelId: channel.id,
        subscriberCount: channel.statistics?.subscriberCount || '0',
        viewCount: channel.statistics?.viewCount || '0',
        videoCount: channel.statistics?.videoCount || '0'
      });
    }
  };

  const logout = () => {
    serviceSetToken('');
    setIsAuthenticated(false);
    setUserProfile(null);
    setAvailableChannels([]);
    googleLogout();
  };

  return (
    <AppContext.Provider value={{ lang, setLang, isDark, toggleTheme, isAuthenticated, userProfile, availableChannels, switchChannel, login, manualLogin, logout }}>
      <Router>
        <div className={`min-h-screen flex flex-col overflow-x-hidden ${isDark ? 'bg-[#050608] text-white' : 'bg-slate-50 text-slate-900'}`}>
          <Header />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tool/policy-check" element={<PolicyCheck />} />
              <Route path="/tool/transcriber" element={<VideoTranscriber />} />
              <Route path="/tool/thumbnail-tester" element={<ThumbnailTester />} />
              <Route path="/tool/:toolId" element={<ToolDetail />} />
              <Route path="/search" element={<MegaSearch />} />
              <Route path="/trending" element={<TrendingDashboard />} />
              <Route path="/categories" element={<CategoryExplorer />} />
              <Route path="/watch/:id" element={<VideoViewer />} />

              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* New Public Tools */}
              <Route path="/tools/compare" element={<ChannelComparison />} />
              <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
              <Route path="/tools/live-counter" element={<LiveCounter />} />
              <Route path="/tools/thumbnail-downloader" element={<ThumbnailDownloader />} />

              {/* Advanced Tools */}
              <Route path="/tools/comment-picker" element={<CommentPicker />} />
              <Route path="/tools/region-check" element={<RegionCheck />} />
              <Route path="/tools/tag-extractor" element={<TagExtractor />} />
              <Route path="/tools/embed-generator" element={<EmbedGenerator />} />
              <Route path="/tools/thumbnail-editor" element={<ThumbnailEditor />} />

              {/* New Utility Tools */}
              <Route path="/tools/channel-audit" element={<ChannelAudit />} />
              <Route path="/tools/qr-code" element={<QRCodeGenerator />} />
              <Route path="/tools/trend-analyzer" element={<TrendAnalyzer />} />
              <Route path="/tools/seo-optimizer" element={<SEOOptimizer />} />
              <Route path="/tools/video-ideas" element={<VideoIdeasGenerator />} />
              <Route path="/tools/advanced-revenue" element={<AdvancedRevenueCalculator />} />
              <Route path="/tools/content-calendar" element={<ContentCalendar />} />
              <Route path="/tools/competitor-tracker" element={<CompetitorTracker />} />
              <Route path="/tools/growth-predictor" element={<GrowthPredictor />} />
              <Route path="/tools/cpm-tracker" element={<CPMTracker />} />
              <Route path="/tools/sponsorship-calculator" element={<SponsorshipCalculator />} />
              <Route path="/tools/notification-tracker" element={<NotificationTracker />} />
              <Route path="/tools/audience-demographics" element={<AudienceDemographics />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
