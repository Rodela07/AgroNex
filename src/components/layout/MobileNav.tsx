import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Sprout, 
  Beef, 
  Fish, 
  ShoppingBag, 
  Menu, 
  X, 
  TrendingUp, 
  Stethoscope, 
  ShieldCheck, 
  User,
  Sparkles
} from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const { language, activeRole, inquiries, orders, setShowPhase2Modal } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pendingCount = inquiries.filter(i => i.status === 'pending').length + orders.filter(o => o.status === 'accepted').length;

  const handleNav = (tab: string) => {
    onSelectTab(tab);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Bottom Sticky Tab Bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-softBorder shadow-lg px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => handleNav('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
            currentTab === 'dashboard' ? 'text-forest font-bold' : 'text-secondaryText'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{language === 'bn' ? 'হোম' : 'Home'}</span>
        </button>

        <button
          onClick={() => handleNav('agriculture')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
            currentTab === 'agriculture' ? 'text-forest font-bold' : 'text-secondaryText'
          }`}
        >
          <Sprout className="w-5 h-5 text-emerald-700" />
          <span className="text-[10px] mt-0.5">{language === 'bn' ? 'কৃষি' : 'Agri'}</span>
        </button>

        <button
          onClick={() => handleNav('livestock')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
            currentTab === 'livestock' ? 'text-forest font-bold' : 'text-secondaryText'
          }`}
        >
          <Beef className="w-5 h-5 text-amber-800" />
          <span className="text-[10px] mt-0.5">{language === 'bn' ? 'খামারি' : 'Livestock'}</span>
        </button>

        <button
          onClick={() => handleNav('fisheries')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
            currentTab === 'fisheries' ? 'text-forest font-bold' : 'text-secondaryText'
          }`}
        >
          <Fish className="w-5 h-5 text-blue-700" />
          <span className="text-[10px] mt-0.5">{language === 'bn' ? 'মৎস্য' : 'Fish'}</span>
        </button>

        <button
          onClick={() => handleNav('marketplace')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
            currentTab === 'marketplace' ? 'text-forest font-bold' : 'text-secondaryText'
          }`}
        >
          <ShoppingBag className="w-5 h-5 text-clay" />
          {pendingCount > 0 && (
            <span className="absolute top-0 right-1 w-2.5 h-2.5 bg-status-error rounded-full" />
          )}
          <span className="text-[10px] mt-0.5">{language === 'bn' ? 'বাজার' : 'Market'}</span>
        </button>

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 text-secondaryText hover:text-forest"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{language === 'bn' ? 'মেন্যু' : 'More'}</span>
        </button>
      </nav>

      {/* Slide-over Mobile Drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-forest-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-softBorder mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-lg text-forest-dark">Agro<span className="text-forest-leaf">Nex</span></span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-forest-light text-forest rounded font-bold">Menu</span>
                  </div>
                  <button 
                    onClick={() => setDrawerOpen(false)}
                    className="p-1 rounded-lg text-secondaryText hover:bg-rice"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleNav('prices')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${
                      currentTab === 'prices' ? 'bg-forest text-white' : 'text-primaryText hover:bg-rice'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-harvest-dark" />
                    <span>{language === 'bn' ? 'বাজার দর ও অ্যানালিটিক্স' : 'Regional Market Prices'}</span>
                  </button>

                  <button
                    onClick={() => handleNav('experts')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${
                      currentTab === 'experts' ? 'bg-forest text-white' : 'text-primaryText hover:bg-rice'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 text-forest-leaf" />
                    <span>{language === 'bn' ? 'বিশেষজ্ঞ পরামর্শ ও ভিডিও কল' : 'Expert Consultations'}</span>
                  </button>

                  <button
                    onClick={() => handleNav('admin')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${
                      currentTab === 'admin' ? 'bg-forest text-white' : 'text-primaryText hover:bg-rice'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span>{language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Portal'}</span>
                  </button>

                  <button
                    onClick={() => handleNav('profile')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${
                      currentTab === 'profile' ? 'bg-forest text-white' : 'text-primaryText hover:bg-rice'
                    }`}
                  >
                    <User className="w-4 h-4 text-secondaryText" />
                    <span>{language === 'bn' ? 'প্রোফাইল ও বহুবিধ রোল' : 'Profile & Multi-Role'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-softBorder space-y-3">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    setShowPhase2Modal(true);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-forest/10 text-forest-dark text-xs font-bold"
                >
                  <Sparkles className="w-4 h-4 text-harvest-dark" />
                  <span>{language === 'bn' ? 'পরবর্তী ধাপের রূপরেখা' : 'Phase 2 Roadmap'}</span>
                </button>
                <p className="text-[10px] text-center text-mutedText">
                  AgroNex Bangladesh • PRD v2.0
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
