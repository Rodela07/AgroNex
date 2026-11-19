import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WeatherWidget } from '../../components/weather/WeatherWidget';
import { 
  Sprout, 
  Beef, 
  Fish, 
  ShoppingBag, 
  Plus, 
  Bot, 
  CalendarCheck, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Check, 
  ChevronRight,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { formatCurrency, formatNumber, toBengaliDigits } from '../../utils/formatters';

interface HomeDashboardProps {
  onNavigate: (tab: string, subtab?: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  const { 
    language, 
    user, 
    activeRole, 
    lands, 
    livestockFarms, 
    ponds, 
    listings, 
    inquiries, 
    orders, 
    marketPrices, 
    reminders, 
    toggleReminderComplete,
    setShowPhase2Modal
  } = useApp();

  const todayStr = new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const pendingReminders = reminders.filter(r => !r.isCompleted);
  const completedReminders = reminders.filter(r => r.isCompleted);

  return (
    <div className="space-y-6">

      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-light text-forest border border-forest/20">
              {language === 'bn' ? 'স্বাগতম' : 'Welcome'}
            </span>
            <span className="text-xs text-secondaryText font-medium">
              {todayStr}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-forest-dark mt-1">
            {user.name}
          </h1>
          <p className="text-xs text-secondaryText mt-0.5">
            {user.village}, {user.upazila}, {user.district} • {user.businessName || 'প্রাকৃতিক চাষাবাদ'}
          </p>
        </div>

        {/* Quick Role Context Pill */}
        <div className="flex items-center space-x-2 bg-rice p-2 rounded-xl border border-softBorder">
          <div className="w-8 h-8 rounded-lg bg-forest text-white flex items-center justify-center font-bold text-xs">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-mutedText">
              {language === 'bn' ? 'সক্রিয় দৃষ্টিভঙ্গি' : 'Active View'}
            </p>
            <p className="text-xs font-bold text-forest-dark">
              {activeRole}
            </p>
          </div>
        </div>
      </div>

      {/* Weather Section with Multi-Sector Actionable Recommendations */}
      <WeatherWidget />

      {/* Quick Actions Toolbar */}
      <div className="bg-warmWhite p-4 rounded-2xl border border-softBorder shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-forest-dark uppercase tracking-wider">
            {language === 'bn' ? 'দ্রুত অ্যাকশন (Quick Actions)' : 'Quick Actions'}
          </h3>
          <span className="text-[11px] text-mutedText">
            {language === 'bn' ? 'ক্লিক করে সরাসরি মডিউলে প্রবেশ করুন' : 'One-click shortcuts'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <button
            onClick={() => onNavigate('agriculture', 'troubleshoot')}
            className="flex flex-col items-center p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 text-forest text-center transition group"
          >
            <Bot className="w-5 h-5 text-forest-leaf mb-1 group-hover:scale-110 transition" />
            <span className="text-xs font-bold">{language === 'bn' ? 'কৃষি এআই' : 'Ask AI'}</span>
          </button>

          <button
            onClick={() => onNavigate('agriculture', 'lands')}
            className="flex flex-col items-center p-3 rounded-xl bg-rice hover:bg-white border border-softBorder text-primaryText text-center transition group"
          >
            <Sprout className="w-5 h-5 text-forest mb-1 group-hover:scale-110 transition" />
            <span className="text-xs font-bold">{language === 'bn' ? 'জমি যোগ' : 'Add Land'}</span>
          </button>

          <button
            onClick={() => onNavigate('livestock', 'farms')}
            className="flex flex-col items-center p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 text-amber-900 text-center transition group"
          >
            <Beef className="w-5 h-5 text-amber-800 mb-1 group-hover:scale-110 transition" />
            <span className="text-xs font-bold">{language === 'bn' ? 'খামার যোগ' : 'Add Farm'}</span>
          </button>

          <button
            onClick={() => onNavigate('fisheries', 'ponds')}
            className="flex flex-col items-center p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 text-river-dark text-center transition group"
          >
            <Fish className="w-5 h-5 text-river mb-1 group-hover:scale-110 transition" />
            <span className="text-xs font-bold">{language === 'bn' ? 'পুকুর যোগ' : 'Add Pond'}</span>
          </button>

          <button
            onClick={() => onNavigate('marketplace', 'sell')}
            className="flex flex-col items-center p-3 rounded-xl bg-clay-light hover:bg-clay/20 border border-clay/30 text-clay-dark text-center transition group"
          >
            <ShoppingBag className="w-5 h-5 text-clay mb-1 group-hover:scale-110 transition" />
            <span className="text-xs font-bold">{language === 'bn' ? 'পণ্য বিক্রি' : 'Sell Produce'}</span>
          </button>

          <button
            onClick={() => onNavigate('prices')}
            className="flex flex-col items-center p-3 rounded-xl bg-harvest-light hover:bg-harvest/20 border border-harvest/30 text-harvest-dark text-center transition group"
          >
            <TrendingUp className="w-5 h-5 text-harvest-dark mb-1 group-hover:scale-110 transition" />
            <span className="text-xs font-bold">{language === 'bn' ? 'বাজার দর' : 'Market Prices'}</span>
          </button>

          <button
            onClick={() => onNavigate('experts')}
            className="flex flex-col items-center p-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-center transition group col-span-2 sm:col-span-1"
          >
            <Sparkles className="w-5 h-5 text-purple-700 mb-1 group-hover:scale-110 transition" />
            <span className="text-xs font-bold">{language === 'bn' ? 'বিশেষজ্ঞ' : 'Find Expert'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 Cols): Daily Activities & Farm Summary */}
        <div className="lg:col-span-2 space-y-6">

          {/* Daily Activities & Scheduled Reminders (Functional Outcome!) */}
          <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CalendarCheck className="w-5 h-5 text-forest" />
                <h3 className="text-sm font-bold text-forest-dark">
                  {language === 'bn' ? 'আজকের কৃষি ও খামারি কার্যক্রম' : 'Today’s Farming Activities & Reminders'}
                </h3>
              </div>
              <span className="text-xs text-secondaryText">
                {language === 'bn' ? `${pendingReminders.length} টি কাজ বাকি` : `${pendingReminders.length} pending`}
              </span>
            </div>

            {reminders.length === 0 ? (
              <p className="text-xs text-secondaryText text-center py-4">
                {language === 'bn' ? 'কোনো রিমাইন্ডার নির্ধারিত নেই।' : 'No reminders set.'}
              </p>
            ) : (
              <div className="space-y-2.5">
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    onClick={() => toggleReminderComplete(rem.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      rem.isCompleted
                        ? 'bg-rice/50 border-softBorder text-mutedText line-through'
                        : 'bg-warmWhite border-softBorder text-primaryText hover:border-forest/40 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                        rem.isCompleted ? 'bg-forest border-forest text-white' : 'border-mutedText bg-white'
                      }`}>
                        {rem.isCompleted && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold">
                          {language === 'bn' ? rem.titleBn : rem.title}
                        </p>
                        <p className="text-[11px] text-secondaryText mt-0.5">
                          {rem.entityName} • {rem.stage} • {language === 'bn' ? toBengaliDigits(rem.date) : rem.date}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      rem.priority === 'high' ? 'bg-red-50 text-status-error' : 'bg-rice text-secondaryText'
                    }`}>
                      {rem.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Module Ecosystem Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Agriculture Summary */}
            <div 
              onClick={() => onNavigate('agriculture')}
              className="p-4 rounded-2xl bg-white border border-softBorder hover:border-forest/40 cursor-pointer shadow-2xs transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                  <Sprout className="w-5 h-5" />
                </span>
                <ChevronRight className="w-4 h-4 text-mutedText group-hover:text-forest transition" />
              </div>
              <h4 className="text-xs font-bold text-forest-dark uppercase tracking-wider">
                {language === 'bn' ? 'কৃষি জমি' : 'Crop Lands'}
              </h4>
              <p className="text-2xl font-black text-primaryText mt-1">
                {language === 'bn' ? toBengaliDigits(lands.length) : lands.length}
                <span className="text-xs font-normal text-secondaryText ml-1">
                  {language === 'bn' ? 'টি প্লট' : 'plots'}
                </span>
              </p>
              <p className="text-[11px] text-secondaryText mt-1">
                {lands[0]?.currentCrop || 'ধান ও রবি ফসল'}
              </p>
            </div>

            {/* Livestock Summary */}
            <div 
              onClick={() => onNavigate('livestock')}
              className="p-4 rounded-2xl bg-white border border-softBorder hover:border-amber-300 cursor-pointer shadow-2xs transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-800">
                  <Beef className="w-5 h-5" />
                </span>
                <ChevronRight className="w-4 h-4 text-mutedText group-hover:text-amber-800 transition" />
              </div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                {language === 'bn' ? 'পশু খামার' : 'Livestock'}
              </h4>
              <p className="text-2xl font-black text-primaryText mt-1">
                {language === 'bn' ? toBengaliDigits(livestockFarms.reduce((acc, f) => acc + f.animalCount, 0)) : livestockFarms.reduce((acc, f) => acc + f.animalCount, 0)}
                <span className="text-xs font-normal text-secondaryText ml-1">
                  {language === 'bn' ? 'টি প্রাণী' : 'animals'}
                </span>
              </p>
              <p className="text-[11px] text-secondaryText mt-1">
                {livestockFarms.length} টি খামার শেড
              </p>
            </div>

            {/* Fisheries Summary */}
            <div 
              onClick={() => onNavigate('fisheries')}
              className="p-4 rounded-2xl bg-white border border-softBorder hover:border-blue-300 cursor-pointer shadow-2xs transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-blue-50 text-river">
                  <Fish className="w-5 h-5" />
                </span>
                <ChevronRight className="w-4 h-4 text-mutedText group-hover:text-river transition" />
              </div>
              <h4 className="text-xs font-bold text-river-dark uppercase tracking-wider">
                {language === 'bn' ? 'মৎস্য পুকুর' : 'Fisheries'}
              </h4>
              <p className="text-2xl font-black text-primaryText mt-1">
                {language === 'bn' ? toBengaliDigits(ponds.length) : ponds.length}
                <span className="text-xs font-normal text-secondaryText ml-1">
                  {language === 'bn' ? 'টি পুকুর' : 'ponds'}
                </span>
              </p>
              <p className="text-[11px] text-secondaryText mt-1">
                {ponds[0]?.farmingType === 'polyculture' ? 'কার্প মিশ্র চাষ' : 'মনোসেক্স চাষ'}
              </p>
            </div>

          </div>

          {/* Marketplace Highlights: Active Negotiations & Orders */}
          <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-clay" />
                <h3 className="text-sm font-bold text-forest-dark">
                  {language === 'bn' ? 'সরাসরি মার্কেটপ্লেস ও দরদাম কার্যক্রম' : 'Direct Marketplace & Active Orders'}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('marketplace', 'inquiries')}
                className="text-xs font-bold text-forest hover:underline flex items-center space-x-1"
              >
                <span>{language === 'bn' ? 'সব দেখুন' : 'View All'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inquiries.slice(0, 2).map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => onNavigate('marketplace', 'inquiries')}
                  className="p-3.5 rounded-xl border border-softBorder hover:border-clay/40 bg-warmWhite cursor-pointer transition shadow-2xs"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-clay truncate max-w-[140px]">{inq.buyerName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-status-warning border border-amber-200">
                      {inq.status}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-forest-dark truncate">{inq.productName}</h5>
                  <p className="text-[11px] text-secondaryText mt-1">
                    {language === 'bn' ? 'প্রস্তাবিত দর:' : 'Offered:'}{' '}
                    <strong>{formatCurrency(inq.currentAgreedPrice, language)}</strong> / {inq.unit}
                    {' '}(পরিমাণ: {language === 'bn' ? toBengaliDigits(inq.requestedQuantity) : inq.requestedQuantity} {inq.unit})
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Market Price Intel & Phase 2 Callout */}
        <div className="space-y-6">

          {/* Regional Market Prices Snapshot */}
          <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-harvest-dark" />
                <h3 className="text-sm font-bold text-forest-dark">
                  {language === 'bn' ? 'আঞ্চলিক পাইকারি বাজার দর' : 'Regional Wholesale Prices'}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('prices')}
                className="text-xs font-bold text-forest hover:underline"
              >
                {language === 'bn' ? 'বিস্তারিত' : 'All'}
              </button>
            </div>

            <p className="text-[11px] text-secondaryText mb-3">
              {language === 'bn' ? 'বগুড়া ও পার্শ্ববর্তী আড়তের আজকের দাম:' : 'Today’s verified market hub rates:'}
            </p>

            <div className="space-y-2.5">
              {marketPrices.slice(0, 4).map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-rice/50 border border-softBorder flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-forest-dark">
                      {language === 'bn' ? item.productBn : item.product}
                    </h5>
                    <p className="text-[10px] text-secondaryText">
                      {item.marketLocation}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-forest-dark block">
                      {formatCurrency(item.wholesalePrice, language)}
                    </span>
                    <span className="text-[10px] text-mutedText">
                      প্রতি {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-softBorder text-center">
              <button
                onClick={() => onNavigate('prices')}
                className="w-full py-2 px-3 text-xs font-bold text-forest hover:bg-forest/5 rounded-xl border border-forest/20 transition"
              >
                {language === 'bn' ? 'মূল্য সতর্কবার্তা (Alert) সেট করুন' : 'Set Price Alert'}
              </button>
            </div>
          </div>

          {/* Phase 2 Feature Discovery Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-forest-900 to-forest-dark text-white shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-harvest" />
              <span className="text-xs font-bold uppercase tracking-wider text-harvest">
                {language === 'bn' ? 'পরবর্তী প্রযুক্তি' : 'Next-Gen'}
              </span>
            </div>
            <h4 className="text-base font-bold mb-1">
              {language === 'bn' ? 'স্যাটেলাইট পর্যবেক্ষণ ও বিকাশ এসক্রো' : 'Satellite Monitoring & Escrow'}
            </h4>
            <p className="text-xs text-rice/80 leading-relaxed mb-4">
              {language === 'bn' 
                ? 'আইওটি সেন্সর, উন্নত এআই ভয়েস বট ও ট্রাক বুকিং সিস্টেমের রোডম্যাপ দেখুন।' 
                : 'Explore upcoming satellite crop health, IoT livestock collars and secure escrow logistics.'}
            </p>
            <button
              onClick={() => setShowPhase2Modal(true)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-warmWhite border border-white/20 transition shadow-2xs"
            >
              {language === 'bn' ? 'রোডম্যাপ দেখুন (Phase 2)' : 'View Roadmap'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
