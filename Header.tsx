import React from 'react';
import { useApp } from '../App';

const Header: React.FC = () => {
  const { isAuthenticated, login, logout, userProfile } = useApp();

  return (
    <header className="bg-[#0a0a0c] border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = '#'}>
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl">Y</div>
          <span className="font-black text-xl tracking-tighter">YT MONETIZATION <span className="text-red-600">CHECK</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#/" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Home</a>
          <a href="#/disclaimer" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Tools</a>
          <a href="#/privacy" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Support</a>
        </nav>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {userProfile?.picture ? (
                <img src={userProfile.picture} alt="Profile" className="w-8 h-8 rounded-full border border-white/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="hidden md:block text-xs font-bold text-white">{userProfile?.name?.split(' ')[0]}</span>
            </div>
            <button
              onClick={logout}
              className="bg-white/10 text-white font-black px-4 py-2 rounded-full text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="bg-white text-black font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            Google Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;