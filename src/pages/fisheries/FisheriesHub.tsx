import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Fish, 
  Plus, 
  Droplets, 
  Activity, 
  Search, 
  Bot, 
  Stethoscope, 
  Trash2, 
  AlertTriangle, 
  Check, 
  Info, 
  Save, 
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Building
} from 'lucide-react';
import { PondProfile, WaterQualityRecord, HatcheryListing } from '../../types';
import { INITIAL_HATCHERIES } from '../../data/mockData';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatNumber, toBengaliDigits } from '../../utils/formatters';

export const FisheriesHub: React.FC<{ initialSubTab?: string }> = ({ initialSubTab = 'overview' }) => {
  const { 
    language, 
    ponds, 
    addPond, 
    updatePond, 
    deletePond,
    waterQualityRecords, 
    addWaterQualityRecord,
    experts,
    bookConsultation,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(initialSubTab);

  // Pond modal state
  const [showPondModal, setShowPondModal] = useState(false);
  const [pondName, setPondName] = useState('');
  const [pondSize, setPondSize] = useState<number>(50);
  const [pondDepth, setPondDepth] = useState<number>(6.0);
  const [farmingType, setFarmingType] = useState<'monoculture' | 'polyculture'>('polyculture');
  const [waterSource, setWaterSource] = useState<any>('Groundwater / Deep Tube-well');
  const [budget, setBudget] = useState<number>(250000);

  // Water Quality Entry State
  const [showWqModal, setShowWqModal] = useState(false);
  const [selectedPondId, setSelectedPondId] = useState<string>(ponds[0]?.id || 'pnd_1');
  const [ph, setPh] = useState<number>(7.4);
  const [ammonia, setAmmonia] = useState<number>(0.02);
  const [dissolvedOxygen, setDissolvedOxygen] = useState<number>(6.2);
  const [tempC, setTempC] = useState<number>(27.5);
  const [transparency, setTransparency] = useState<number>(28);

  // Hatchery Directory Filter state
  const [hatcherySearch, setHatcherySearch] = useState('');
  const [hatcheryDistrict, setHatcheryDistrict] = useState('All');

  // AI Fisheries Assistant state
  const [fishChat, setFishChat] = useState<Array<{ sender: 'user' | 'bot'; text: string; alert?: boolean }>>([
    {
      sender: 'bot',
      text: 'নমস্কার / আসসালামু আলাইকুম। আমি এগ্রোনেক্স মৎস্য এআই সহকারী। আপনার পুকুরের মাছের ভাসমান হাবভাব, খাবার গ্রহণ হ্রাস বা জলের রঙ পরিবর্তন সংক্রান্ত যেকোনো প্রশ্ন করুন।'
    }
  ]);
  const [fishInput, setFishInput] = useState('');

  // Delete target
  const [deleteTargetPondId, setDeleteTargetPondId] = useState<string | null>(null);

  const handleSavePond = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pondName.trim()) return;

    addPond({
      name: pondName,
      sizeDecimal: Number(pondSize),
      depthFeet: Number(pondDepth),
      waterSource,
      farmingType,
      primarySpecies: farmingType === 'polyculture' ? ['Rui (রুই)', 'Katla (কাতলা)', 'Mrigal (মৃগেল)'] : ['Monosex Tilapia (তেলাপিয়া)'],
      district: 'Mymensingh',
      upazila: 'Trishal',
      budget: Number(budget),
      stockingDate: new Date().toISOString().split('T')[0]
    });
    setShowPondModal(false);
  };

  const handleSaveWaterQuality = (e: React.FormEvent) => {
    e.preventDefault();

    // Evaluation thresholds:
    // pH safe: 6.5 - 8.5
    // Ammonia safe: <= 0.05 ppm
    // DO safe: >= 5.0 mg/L
    let status: 'optimal' | 'warning' | 'critical' = 'optimal';
    const recs: string[] = [];

    if (ammonia > 0.08 || dissolvedOxygen < 3.5 || ph < 6.0 || ph > 9.0) {
      status = 'critical';
      recs.push('জরুরি সতর্কতা: পুকুরের জলে বিষাক্ত অ্যামোনিয়া বৃদ্ধি ও মারাত্মক অক্সিজেন সংকট!');
      recs.push('তাত্ক্ষণিক ব্যবস্থা: খাবার সরবরাহ সম্পূর্ণ বন্ধ রাখুন, অবিলম্বে এয়ারেটর চালু করুন এবং নতুন পরিষ্কার জল প্রবেশ করান।');
    } else if (ammonia > 0.04 || dissolvedOxygen < 5.0 || ph < 6.5 || ph > 8.5) {
      status = 'warning';
      recs.push('সতর্কতা: প্যারামিটার সামান্য অস্বাভাবিক। খাবার ২৫% হ্রাস করুন এবং শতাংশ প্রতি ২৫০ গ্রাম চুন প্রয়োগ করুন।');
    } else {
      recs.push('পুকুরের জলের সকল সূচক স্বাভাবিক ও উৎপাদন অনুকূল রয়েছে। সাধারণ নিয়মে খাদ্য প্রদান চালিয়ে যান।');
    }

    addWaterQualityRecord({
      pondId: selectedPondId,
      recordedDate: new Date().toLocaleString(),
      ph: Number(ph),
      ammoniaPpm: Number(ammonia),
      dissolvedOxygenMgL: Number(dissolvedOxygen),
      temperatureC: Number(tempC),
      transparencyCm: Number(transparency),
      status,
      recommendations: recs
    });

    setShowWqModal(false);
  };

  const handleSendFishAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fishInput.trim()) return;

    const userMsg = fishInput;
    setFishChat(prev => [...prev, { sender: 'user', text: userMsg }]);
    setFishInput('');

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      const isOxygenAlert = lower.includes('ভেসে') || lower.includes('খাবি') || lower.includes('অক্সিজেন') || lower.includes('মরে');

      let reply = '';
      if (isOxygenAlert) {
        reply = `🚨 জরুরি সংকট বিশ্লেষণ:\nমাছ ভোরে জলের উপরিভাগে ভেসে খাবি খাওয়ার অর্থ হলো দ্রবীভূত অক্সিজেন (DO) আশঙ্কাজনকভাবে কমে গেছে।\n\nতাত্ক্ষণিক পদক্ষেপ:\n১. সাঁতার কেটে বা বাঁশ পিটিয়ে জলের ওপর ঢেউ সৃষ্টি করুন অথবা এয়ারেটর থাকলে দ্রুত চালু করুন।\n২. পুকুরে তাৎক্ষণিক টিউবওয়েল থেকে নতুন জল প্রবেশ করান।\n৩. অক্সিজেন পাউডার (যেমন অক্সিফ্লো বা অক্সিম্যাক্স) প্রতি শতাংশে ৫০-১০০ গ্রাম হারে ছিটিয়ে দিন।\n৪. আজকের দিনের খাবার দেওয়া সম্পূর্ণ বন্ধ রাখুন।`;
      } else {
        reply = `মৎস্য পুষ্টি ও পরিচর্যা পরামর্শ:\nমাছের খাবার গ্রহণ কমে যাওয়ার প্রধান কারণগুলোর মধ্যে রয়েছে জলের তাপমাত্রা কমে যাওয়া অথবা অ্যামোনিয়ার আধিক্য।\n\nপ্রস্তাবিত পদক্ষেপ:\n১. খাদ্য প্রয়োগের ১ ঘণ্টা পর ট্রে পর্যবেক্ষণ করুন খাবার অবশিষ্ট থাকে কিনা।\n২. পুকুরের তলদেশে গ্যাস তৈরি হয়েছে কিনা বাঁশ বা হররা টেনে পরীক্ষা করুন।\n৩. প্রোবায়োটিক বা জিওলাইট প্রয়োগ করে তলদেশের বিষাক্ত গ্যাস দূর করুন।`;
      }

      setFishChat(prev => [...prev, { sender: 'bot', text: reply, alert: isOxygenAlert }]);
    }, 600);
  };

  const filteredHatcheries = INITIAL_HATCHERIES.filter(h => {
    const matchSearch = h.hatcheryName.toLowerCase().includes(hatcherySearch.toLowerCase()) ||
                        h.ownerName.toLowerCase().includes(hatcherySearch.toLowerCase());
    const matchDistrict = hatcheryDistrict === 'All' || h.district === hatcheryDistrict;
    return matchSearch && matchDistrict;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-blue-50 text-river-dark">
            <Fish className="w-5 h-5 text-river" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-forest-dark">
              {language === 'bn' ? 'মৎস্য মডিউল (Fisheries Hub)' : 'Fisheries & Aquaculture Hub'}
            </h1>
            <p className="text-xs text-secondaryText">
              {language === 'bn' ? 'পুকুর ব্যবস্থাপনা, জলের গুণমান (DO/pH/Ammonia) ট্র্যাকিং, পোনা ও হ্যাচারি ডিরেক্টরি' : 'Pond management, water quality telemetry, fingerling guides & hatchery network'}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowWqModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-river/10 text-river-dark hover:bg-river/20 text-xs font-bold transition"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>জলের পরীক্ষা রেকর্ড</span>
          </button>
          <button
            onClick={() => setShowPondModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-forest hover:bg-forest-dark text-white text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন পুকুর যোগ</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-softBorder overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'overview', labelBn: 'একনজরে (Overview)' },
          { id: 'ponds', labelBn: 'আমার পুকুর (My Ponds)' },
          { id: 'water', labelBn: 'জলের গুণমান ট্র্যাকিং (Water Quality)' },
          { id: 'hatcheries', labelBn: 'হ্যাচারি ও পোনা ডিরেক্টরি (Hatcheries)' },
          { id: 'aifish', labelBn: 'এআই মৎস্য সহকারী (AI Assistant)' },
          { id: 'specialist', labelBn: 'মৎস্য বিশেষজ্ঞ (Ask Specialist)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition ${
              activeTab === tab.id 
                ? 'bg-river text-white shadow-2xs' 
                : 'text-secondaryText hover:text-river-dark hover:bg-rice'
            }`}
          >
            {tab.labelBn}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-softBorder">
              <span className="text-xs text-secondaryText font-medium">নিবন্ধিত সক্রিয় পুকুর</span>
              <p className="text-2xl font-black text-forest-dark mt-1">
                {toBengaliDigits(ponds.length)} টি
              </p>
              <p className="text-[11px] text-mutedText mt-1">
                মোট আয়তন: {ponds.reduce((acc, p) => acc + p.sizeDecimal, 0)} শতাংশ
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-softBorder">
              <span className="text-xs text-secondaryText font-medium">সর্বশেষ জলের প্যারামিটার</span>
              <p className="text-base font-bold text-forest-dark mt-1">
                pH: {waterQualityRecords[0]?.ph || 7.4} • DO: {waterQualityRecords[0]?.dissolvedOxygenMgL || 6.2} mg/L
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                অ্যামোনিয়া: {waterQualityRecords[0]?.ammoniaPpm || 0.02} ppm (স্বাভাবিক)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-softBorder">
              <span className="text-xs text-secondaryText font-medium">প্রধান চাষকৃত প্রজাতি</span>
              <p className="text-base font-bold text-clay mt-1">
                রুই, কাতলা ও মনোসেক্স তেলাপিয়া
              </p>
              <p className="text-[11px] text-mutedText mt-1">
                ত্রিশাল, ময়মনসিংহ ক্লাস্টার
              </p>
            </div>
          </div>

          {/* Ponds Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ponds.map((pnd) => (
              <div key={pnd.id} className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-river uppercase">
                        {pnd.farmingType === 'polyculture' ? 'মিশ্র কার্প চাষ' : 'মনোসেক্স চাষ'}
                      </span>
                      <h4 className="text-base font-bold text-forest-dark mt-1">{pnd.name}</h4>
                      <p className="text-xs text-secondaryText">{pnd.upazila}, {pnd.district}</p>
                    </div>
                    <span className="text-xs font-bold text-primaryText">
                      {toBengaliDigits(pnd.sizeDecimal)} শতাংশ
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-softBorder text-xs">
                    <div>
                      <span className="text-[10px] text-secondaryText block">গড় গভীরতা</span>
                      <span className="font-semibold">{toBengaliDigits(pnd.depthFeet)} ফুট</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-secondaryText block">জলের উৎস</span>
                      <span className="font-semibold">{pnd.waterSource}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] text-secondaryText block">মাছের প্রজাতি:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {pnd.primarySpecies.map((sp, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-rice font-medium text-primaryText">
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-softBorder flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedPondId(pnd.id);
                      setShowWqModal(true);
                    }}
                    className="text-xs font-bold text-river hover:underline"
                  >
                    + জলের পরীক্ষা যোগ
                  </button>
                  <button
                    onClick={() => setActiveTab('aifish')}
                    className="text-xs font-bold text-forest hover:underline"
                  >
                    রোগবালাই সমাধান →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY PONDS */}
      {activeTab === 'ponds' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ponds.map((pnd) => (
              <div key={pnd.id} className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-forest-dark">{pnd.name}</h4>
                    <p className="text-xs text-secondaryText">আয়তন: {toBengaliDigits(pnd.sizeDecimal)} শতক • গভীরতা: {toBengaliDigits(pnd.depthFeet)} ফুট</p>
                  </div>
                  <button
                    onClick={() => setDeleteTargetPondId(pnd.id)}
                    className="p-1.5 text-secondaryText hover:text-status-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-rice/60 space-y-1 text-xs">
                  <p><span className="text-secondaryText">চাষ পদ্ধতি:</span> <strong>{pnd.farmingType}</strong></p>
                  <p><span className="text-secondaryText">স্টকিং তারিখ:</span> {toBengaliDigits(pnd.stockingDate)}</p>
                  <p><span className="text-secondaryText">আনুমানিক বিনিয়োগ:</span> {formatCurrency(pnd.budget, language)}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-mutedText">সর্বশেষ হালনাগাদ: {pnd.lastUpdated}</span>
                  <button
                    onClick={() => {
                      setSelectedPondId(pnd.id);
                      setShowWqModal(true);
                    }}
                    className="text-xs font-bold text-river hover:underline"
                  >
                    প্যারামিটার পরীক্ষা করুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WATER QUALITY MANAGEMENT (pH, Ammonia, DO, Temperature) */}
      {activeTab === 'water' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-forest-dark">পুকুরের জলের গুণমান লগ ও টেলিমেট্রি</h3>
              <p className="text-xs text-secondaryText">আদর্শ মানদণ্ড: pH (৬.৫-৮.৫), অ্যামোনিয়া (&lt; ০.০৫ ppm), দ্রবীভূত অক্সিজেন (&gt; ৫.০ mg/L)</p>
            </div>
            <button
              onClick={() => setShowWqModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-river text-white text-xs font-bold hover:bg-river-dark transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন টেস্ট এন্ট্রি</span>
            </button>
          </div>

          <div className="space-y-3">
            {waterQualityRecords.map((rec) => (
              <div key={rec.id} className="p-4 rounded-2xl bg-white border border-softBorder shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-forest-dark">
                      {ponds.find(p => p.id === rec.pondId)?.name || 'পুকুর ১'}
                    </span>
                    <span className="text-[11px] text-mutedText">• {rec.recordedDate}</span>
                  </div>
                  <StatusBadge status={rec.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-rice">
                    <span className="text-[10px] text-secondaryText block">pH সূচক</span>
                    <span className={`font-black text-sm ${rec.ph < 6.5 || rec.ph > 8.5 ? 'text-status-error' : 'text-forest-dark'}`}>
                      {rec.ph}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-rice">
                    <span className="text-[10px] text-secondaryText block">অ্যামোনিয়া (Ammonia)</span>
                    <span className={`font-black text-sm ${rec.ammoniaPpm > 0.05 ? 'text-status-error' : 'text-forest-dark'}`}>
                      {rec.ammoniaPpm} ppm
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-rice">
                    <span className="text-[10px] text-secondaryText block">দ্রবীভূত অক্সিজেন (DO)</span>
                    <span className={`font-black text-sm ${rec.dissolvedOxygenMgL < 5.0 ? 'text-status-error' : 'text-emerald-700'}`}>
                      {rec.dissolvedOxygenMgL} mg/L
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-rice">
                    <span className="text-[10px] text-secondaryText block">তাপমাত্রা</span>
                    <span className="font-black text-sm text-primaryText">
                      {rec.temperatureC}°C
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-rice col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-secondaryText block">স্বচ্ছতা (Secchi)</span>
                    <span className="font-black text-sm text-primaryText">
                      {rec.transparencyCm} সেমি
                    </span>
                  </div>
                </div>

                {rec.recommendations.length > 0 && (
                  <div className={`p-3 rounded-xl text-xs space-y-1 ${
                    rec.status === 'optimal' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}>
                    <span className="font-bold block">ব্যবস্থাপনা সুপারিশ:</span>
                    {rec.recommendations.map((r, i) => (
                      <p key={i}>• {r}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HATCHERY & FINGERLING DIRECTORY */}
      {activeTab === 'hatcheries' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-mutedText" />
              <input
                type="text"
                placeholder="হ্যাচারি বা মালিকের নাম দিয়ে খুঁজুন..."
                value={hatcherySearch}
                onChange={(e) => setHatcherySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-softBorder bg-white outline-none focus:border-river"
              />
            </div>
            <select
              value={hatcheryDistrict}
              onChange={(e) => setHatcheryDistrict(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-softBorder bg-white outline-none"
            >
              <option value="All">সকল জেলা</option>
              <option value="Mymensingh">ময়মনসিংহ</option>
              <option value="Bogura">বগুড়া</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHatcheries.map((hat) => (
              <div key={hat.id} className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-sm font-bold text-forest-dark">{hat.hatcheryName}</h4>
                      {hat.verified && <span className="text-[10px] text-emerald-700 font-bold">✓ ভেরিফাইড</span>}
                    </div>
                    <p className="text-xs text-secondaryText">প্রোপাইটর: {hat.ownerName} • {hat.upazila}, {hat.district}</p>
                  </div>
                  <span className="text-xs font-bold text-harvest-dark">★ {hat.rating} ({hat.reviewsCount})</span>
                </div>

                <div className="border-t border-softBorder pt-2 space-y-1.5">
                  <span className="text-[11px] font-bold text-forest-dark">উপলব্ধ পোনা ও বর্তমান রেট:</span>
                  {hat.species.map((sp, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-rice/50">
                      <div>
                        <span className="font-semibold text-primaryText">{sp.name}</span>
                        <span className="text-[10px] text-mutedText ml-1">({sp.sizeInch})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-river">{toBengaliDigits(sp.pricePerThousand)} ৳</span>
                        <span className="text-[10px] text-mutedText"> / হাজার</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-softBorder">
                  <span className="text-xs font-bold text-primaryText">হটলাইন: {hat.phone}</span>
                  <button
                    onClick={() => {
                      showToast(`হ্যাচারির সাথে ক্রয় অনুসন্ধান প্রেরণ করা হয়েছে (${hat.hatcheryName})`, 'success');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-forest text-white text-xs font-bold hover:bg-forest-dark transition"
                  >
                    পোনা অর্ডার অনুসন্ধান
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AI FISHERIES ASSISTANT */}
      {activeTab === 'aifish' && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-softBorder shadow-2xs overflow-hidden flex flex-col h-[550px]">
          <div className="bg-gradient-to-r from-river-dark to-river text-white p-4 flex items-center space-x-3">
            <Bot className="w-6 h-6 text-sky-200" />
            <div>
              <h3 className="text-sm font-bold">এআই মৎস্য সহকারী (Fisheries AI Troubleshooter)</h3>
              <p className="text-[11px] text-rice/80">পুকুরের জলের সংকট, মাছের রোগ ও প্রতিরোধমূলক সমাধান</p>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-rice/30">
            {fishChat.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs whitespace-pre-line leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-forest text-white rounded-br-xs'
                    : msg.alert
                    ? 'bg-red-50 border border-status-error text-status-error font-medium rounded-bl-xs'
                    : 'bg-white border border-softBorder text-primaryText rounded-bl-xs shadow-2xs'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendFishAI} className="p-3 bg-white border-t border-softBorder flex items-center space-x-2">
            <input
              type="text"
              placeholder="পুকুরের সমস্যা লিখুন (যেমন: ভোরে সব রুই মাছ ভেসে খাবি খাচ্ছে)..."
              value={fishInput}
              onChange={(e) => setFishInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-softBorder bg-warmWhite outline-none focus:border-river"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-river hover:bg-river-dark text-white font-bold text-xs transition"
            >
              পাঠান
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: ASK SPECIALIST */}
      {activeTab === 'specialist' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experts.filter(e => e.category === 'fisheries').map((fishExp) => (
              <div key={fishExp.id} className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs flex items-start space-x-4">
                <img src={fishExp.avatarUrl} alt={fishExp.name} className="w-16 h-16 rounded-2xl object-cover border border-softBorder shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-sm font-bold text-forest-dark">{fishExp.nameBn}</h4>
                    <span className="text-[10px] text-status-success font-bold">ভেরিফাইড</span>
                  </div>
                  <p className="text-xs text-secondaryText font-medium mt-0.5">{fishExp.designationBn}</p>
                  <p className="text-[11px] text-mutedText mt-1">{fishExp.aboutBn}</p>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-softBorder">
                    <span className="text-xs font-bold text-river">ফি: ৳ {toBengaliDigits(fishExp.consultationFee)}</span>
                    <button
                      onClick={() => {
                        bookConsultation({
                          expertId: fishExp.id,
                          expertName: fishExp.nameBn,
                          category: 'fisheries',
                          farmerId: 'usr_001',
                          farmerName: 'মো: রফিকুল ইসলাম',
                          farmerPhone: '01712345678',
                          sector: 'fisheries',
                          topic: 'পুকুর প্রস্তুতি ও মাছের রোগ নিরীক্ষা',
                          urgency: 'normal',
                          description: 'পুকুরের জলের গুণমান ও বৃদ্ধির হার পর্যালোচনা',
                          preferredDate: new Date().toISOString().split('T')[0],
                          preferredTime: '11:30 AM'
                        });
                      }}
                      className="px-4 py-1.5 rounded-xl bg-river hover:bg-river-dark text-white font-bold text-xs transition shadow-sm"
                    >
                      পরামর্শ শিডিউল করুন
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD POND */}
      <Modal
        isOpen={showPondModal}
        onClose={() => setShowPondModal(false)}
        title="নতুন মৎস্য পুকুর প্রোফাইল যোগ করুন"
        maxWidth="md"
      >
        <form onSubmit={handleSavePond} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-primaryText mb-1">পুকুরের নাম *</label>
            <input
              type="text"
              required
              placeholder="যেমন: ত্রিশাল কার্প নার্সারি"
              value={pondName}
              onChange={(e) => setPondName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-primaryText mb-1">আয়তন (শতাংশ) *</label>
              <input
                type="number"
                value={pondSize}
                onChange={(e) => setPondSize(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">গড় গভীরতা (ফুট)</label>
              <input
                type="number"
                step="0.5"
                value={pondDepth}
                onChange={(e) => setPondDepth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-primaryText mb-1">চাষের ধরন</label>
              <select
                value={farmingType}
                onChange={(e) => setFarmingType(e.target.value as any)}
                className="w-full px-2 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              >
                <option value="polyculture">কার্প মিশ্র চাষ (Polyculture)</option>
                <option value="monoculture">মনোসেক্স একক চাষ (Monoculture)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">জলের প্রধান উৎস</label>
              <select
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="w-full px-2 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              >
                <option value="Groundwater / Deep Tube-well">গভীর নলকূপ</option>
                <option value="River / Canal">নদী বা খাল</option>
                <option value="Rainfed Reservoir">বৃষ্টি নির্ভর জলাশয়</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-softBorder">
            <button
              type="button"
              onClick={() => setShowPondModal(false)}
              className="px-4 py-2 font-semibold text-secondaryText"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-river rounded-xl hover:bg-river-dark transition"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD WATER QUALITY TEST */}
      <Modal
        isOpen={showWqModal}
        onClose={() => setShowWqModal(false)}
        title="পুকুরের জলের গুণমান টেস্ট এন্ট্রি"
        maxWidth="md"
      >
        <form onSubmit={handleSaveWaterQuality} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-primaryText mb-1">পুকুর নির্বাচন করুন</label>
            <select
              value={selectedPondId}
              onChange={(e) => setSelectedPondId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
            >
              {ponds.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sizeDecimal} শতক)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">pH সূচক (আদর্শ: ৬.৫ - ৮.৫)</label>
              <input
                type="number"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">অ্যামোনিয়া ppm (আদর্শ: &lt; ০.০৫)</label>
              <input
                type="number"
                step="0.01"
                value={ammonia}
                onChange={(e) => setAmmonia(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">দ্রবীভূত অক্সিজেন DO (আদর্শ: &gt; ৫.০ mg/L)</label>
              <input
                type="number"
                step="0.1"
                value={dissolvedOxygen}
                onChange={(e) => setDissolvedOxygen(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">জলের তাপমাত্রা (°C)</label>
              <input
                type="number"
                step="0.5"
                value={tempC}
                onChange={(e) => setTempC(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-primaryText mb-1">স্বচ্ছতা (Secchi Disk সেমি)</label>
            <input
              type="number"
              value={transparency}
              onChange={(e) => setTransparency(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-softBorder">
            <button
              type="button"
              onClick={() => setShowWqModal(false)}
              className="px-4 py-2 font-semibold text-secondaryText"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-river rounded-xl hover:bg-river-dark transition"
            >
              টেস্ট বিশ্লেষণ ও সংরক্ষণ
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE POND */}
      <ConfirmDialog
        isOpen={deleteTargetPondId !== null}
        title="পুকুর রেকর্ড মুছে ফেলবেন?"
        message="এই পুকুর এবং এর অতীত জলের গুণমানের তথ্য মুছে ফেলা হবে। আপনি কি নিশ্চিত?"
        onConfirm={() => {
          if (deleteTargetPondId) deletePond(deleteTargetPondId);
          setDeleteTargetPondId(null);
        }}
        onCancel={() => setDeleteTargetPondId(null)}
      />

    </div>
  );
};
