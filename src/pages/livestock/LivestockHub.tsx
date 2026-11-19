import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Beef, 
  Plus, 
  HeartPulse, 
  Syringe, 
  BookOpen, 
  Calculator, 
  Bot, 
  AlertTriangle, 
  PhoneCall, 
  Trash2, 
  Edit3, 
  Check, 
  Clock, 
  Save, 
  Mic, 
  ShieldAlert,
  ChevronRight,
  Info
} from 'lucide-react';
import { LivestockFarm, AnimalRecord, VaccinationRecord, FeedingLog, LivestockType } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatNumber, toBengaliDigits } from '../../utils/formatters';

export const LivestockHub: React.FC<{ initialSubTab?: string }> = ({ initialSubTab = 'overview' }) => {
  const { 
    language, 
    livestockFarms, 
    addLivestockFarm, 
    updateLivestockFarm, 
    deleteLivestockFarm,
    animals, 
    addAnimal, 
    updateAnimal, 
    deleteAnimal,
    vaccinations, 
    addVaccination, 
    updateVaccinationStatus,
    feedingLogs, 
    addFeedingLog,
    experts,
    bookConsultation
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(initialSubTab);

  // Farm modal state
  const [showFarmModal, setShowFarmModal] = useState(false);
  const [farmName, setFarmName] = useState('');
  const [livestockType, setLivestockType] = useState<LivestockType>('cattle');
  const [animalCount, setAnimalCount] = useState<number>(10);
  const [purpose, setPurpose] = useState<any>('Dairy (দুগ্ধ)');
  const [spaceSqFt, setSpaceSqFt] = useState<number>(2000);
  const [budget, setBudget] = useState<number>(500000);

  // Animal modal state
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<string>(livestockFarms[0]?.id || 'lsk_1');
  const [tagNumber, setTagNumber] = useState('');
  const [animalBreed, setAnimalBreed] = useState('Friesian Cross (হোলস্টেইন ফ্রিজিয়ান সংকর)');
  const [animalAge, setAnimalAge] = useState<number>(24);
  const [animalGender, setAnimalGender] = useState<'Male' | 'Female'>('Female');
  const [animalWeight, setAnimalWeight] = useState<number>(350);
  const [animalHealth, setAnimalHealth] = useState<any>('healthy');

  // Vaccination modal state
  const [showVacModal, setShowVacModal] = useState(false);
  const [vacName, setVacName] = useState('FMD Vaccine (খুরারোগের টিকা)');
  const [vacTag, setVacTag] = useState('');
  const [vacAdminDate, setVacAdminDate] = useState(new Date().toISOString().split('T')[0]);
  const [vacNextDate, setVacNextDate] = useState(new Date(Date.now() + 86400000 * 180).toISOString().split('T')[0]);
  const [vacVet, setVacVet] = useState('ডা: নাজমুল হক (DVM)');

  // FCR Calculator state
  const [fcrFeed, setFcrFeed] = useState<number>(150);
  const [fcrWeightGain, setFcrWeightGain] = useState<number>(25);
  const [calculatedFCR, setCalculatedFCR] = useState<number | null>(6.0);

  // AI Vet Assistant state
  const [vetChatMessages, setVetChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; isEmergency?: boolean }>>([
    {
      sender: 'bot',
      text: 'আসসালামু আলাইকুম। আমি এগ্রোনেক্স এআই ভেট অ্যাসিস্ট্যান্ট। আপনার গবাদিপশু বা হাঁস-মুরগির যেকোনো অসুস্থতা, আচরণগত পরিবর্তন বা পুষ্টি সংক্রান্ত লক্ষণ নিচে বিস্তারিত জানান।'
    }
  ]);
  const [vetInput, setVetInput] = useState('');
  const [vetAnimalSelect, setVetAnimalSelect] = useState<'cattle' | 'goat' | 'poultry'>('cattle');

  // Emergency Doctor Booking state
  const [selectedVetForEmergency, setSelectedVetForEmergency] = useState<any | null>(null);

  // Delete target
  const [deleteTargetFarmId, setDeleteTargetFarmId] = useState<string | null>(null);

  const handleSaveFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim()) return;

    addLivestockFarm({
      name: farmName,
      livestockType,
      animalCount: Number(animalCount),
      budget: Number(budget),
      purpose,
      district: 'Bogura',
      upazila: 'Shibganj',
      availableSpaceSqFt: Number(spaceSqFt),
      capacity: Math.round(Number(spaceSqFt) / (livestockType === 'cattle' ? 80 : livestockType === 'goat' ? 25 : 2)),
      setupCostEstimate: Math.round(Number(budget) * 0.6),
      monthlyOperatingCost: Math.round(Number(budget) * 0.12)
    });
    setShowFarmModal(false);
  };

  const handleSaveAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagNumber.trim()) return;

    addAnimal({
      farmId: selectedFarmId,
      tagNumber,
      breed: animalBreed,
      ageMonths: Number(animalAge),
      gender: animalGender,
      weightKg: Number(animalWeight),
      healthStatus: animalHealth
    });
    setShowAnimalModal(false);
  };

  const handleSaveVaccination = (e: React.FormEvent) => {
    e.preventDefault();
    addVaccination({
      farmId: selectedFarmId,
      animalIdOrGroup: vacTag || 'সবার জন্য প্রযোজ্য (Group)',
      vaccineName: vacName,
      administeredDate: vacAdminDate,
      nextDueDate: vacNextDate,
      veterinarian: vacVet,
      status: 'upcoming'
    });
    setShowVacModal(false);
  };

  const handleCalculateFCR = () => {
    if (fcrWeightGain > 0) {
      const fcr = Math.round((fcrFeed / fcrWeightGain) * 100) / 100;
      setCalculatedFCR(fcr);
      addFeedingLog({
        farmId: livestockFarms[0]?.id || 'lsk_1',
        date: new Date().toISOString().split('T')[0],
        feedType: 'দানাদার ফিড ও সবুজ ঘাস',
        feedQuantityKg: Number(fcrFeed),
        totalWeightGainKg: Number(fcrWeightGain),
        calculatedFCR: fcr
      });
    }
  };

  const handleSendVetAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vetInput.trim()) return;

    const userText = vetInput;
    setVetChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setVetInput('');

    // Rule-based veterinary safety evaluation
    setTimeout(() => {
      const lower = userText.toLowerCase();
      const isCritical = lower.includes('খুরা') || lower.includes('ফেনা') || lower.includes('তড়কা') || lower.includes('পায়ে ঘা') || lower.includes('জরুরি') || lower.includes('fever') || lower.includes('১০৩');

      let reply = '';
      if (isCritical) {
        reply = `⚠️ জরুরি সংকেত চিহ্নিত: আপনার বর্ণনায় খুরা রোগ (FMD) বা তীব্র সংক্রামক জ্বরের লক্ষণ পরিলক্ষিত হয়েছে।\n\nতাত্ক্ষণিক পদক্ষেপ:\n১. আক্রান্ত পশুকে সুস্থ পশু থেকে আলাদা (Quarantine) করুন।\n২. মুখে ও ক্ষুরে ফিটকিরি বা পটাশ মিশ্রিত হালকা কুসুম গরম জল দিয়ে পরিষ্কার করুন।\n৩. শক্ত খড়ের বদলে নরম জাউ ও ভাতের মাড় দিন।\n\n🚨 এই ক্ষেত্রে দ্রুত রেজিস্টার্ড পশু চিকিৎসকের সরাসরি ইনজেকশন ও চিকিৎসা প্রয়োজন। নিচে জরুরি ডক্টর কলে সংযুক্ত হন।`;
      } else {
        reply = `প্রাথমিক নিরীক্ষা পরামর্শ:\nআপনার বর্ণনাকৃত লক্ষণ সাধারণ বদহজম বা আবহাওয়া পরিবর্তনের চাপজনিত হতে পারে।\n\nপ্রস্তাবিত পরিচর্যা:\n১. খাবার সোডা (Sodium Bicarbonate) ২০-৩০ গ্রাম হালকা জলে গুলিয়ে খেতে দিন।\n২. পরিষ্কার বিশুদ্ধ খাবার পানি ও তাজা নেপিয়ার ঘাস সরবরাহ রাখুন।\n৩. যদি ২৪ ঘণ্টার মধ্যে লক্ষণ না কমে, তবে রক্ত বা মল পরীক্ষার জন্য উপজেলা প্রাণিসম্পদ হাসপাতালে যোগাযোগ করুন।`;
      }

      setVetChatMessages(prev => [...prev, { sender: 'bot', text: reply, isEmergency: isCritical }]);
    }, 600);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-amber-50 text-amber-900">
            <Beef className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-forest-dark">
              {language === 'bn' ? 'পশু ও খামারি মডিউল (Veterinary & Livestock)' : 'Livestock & Veterinary Hub'}
            </h1>
            <p className="text-xs text-secondaryText">
              {language === 'bn' ? 'গবাদিপশু খামার পরিকল্পনা, টিকা শিডিউল, FCR ক্যালকুলেটর ও এআই ভেট ডাক্তার' : 'Cattle & goat farm planning, vaccination schedules, FCR calculator and AI vet'}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowAnimalModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rice text-primaryText hover:bg-forest/10 border border-softBorder text-xs font-bold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>পশু নিবন্ধন</span>
          </button>
          <button
            onClick={() => setShowFarmModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-forest hover:bg-forest-dark text-white text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>খামার যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-softBorder overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'overview', labelBn: 'একনজরে (Overview)' },
          { id: 'farms', labelBn: 'আমার খামার (Farms)' },
          { id: 'animals', labelBn: 'পশু ব্যবস্থাপনা (Animals)' },
          { id: 'breeds', labelBn: 'জাত নির্বাচন গাইড (Breeds)' },
          { id: 'nutrition', labelBn: 'পুষ্টি ও FCR ক্যালকুলেটর (FCR)' },
          { id: 'vaccines', labelBn: 'টিকা ও কৃমিনাশক (Vaccines)' },
          { id: 'aivet', labelBn: 'এআই ভেট ডাক্তার (AI Vet Assistant)' },
          { id: 'emergency', labelBn: 'জরুরি চিকিৎসক (Emergency Vet)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition ${
              activeTab === tab.id 
                ? 'bg-amber-900 text-white shadow-2xs' 
                : 'text-secondaryText hover:text-amber-900 hover:bg-rice'
            }`}
          >
            {tab.labelBn}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-softBorder">
              <span className="text-xs text-secondaryText font-medium">নিবন্ধিত খামার শেড</span>
              <p className="text-2xl font-black text-amber-900 mt-1">
                {toBengaliDigits(livestockFarms.length)} টি খামার
              </p>
              <p className="text-[11px] text-mutedText mt-1">
                ধারণক্ষমতা: {livestockFarms.reduce((acc, f) => acc + f.capacity, 0)} টি পশু
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-softBorder">
              <span className="text-xs text-secondaryText font-medium">মোট পশু সংখ্যা</span>
              <p className="text-2xl font-black text-forest-dark mt-1">
                {toBengaliDigits(animals.length)} টি
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                সুস্থ: {animals.filter(a => a.healthStatus === 'healthy').length} • চিকিৎসাধীন: {animals.filter(a => a.healthStatus === 'treatment').length}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-softBorder">
              <span className="text-xs text-secondaryText font-medium">আসন্ন টিকার তারিখ</span>
              <p className="text-sm font-bold text-status-warning mt-1">
                ১০ ডিসেম্বর ২০২৬
              </p>
              <p className="text-[11px] text-mutedText mt-1">
                খুরারোগ (FMD) বুস্টার ডোজ
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-softBorder">
              <span className="text-xs text-secondaryText font-medium">গড় খাদ্য রূপান্তর হার (FCR)</span>
              <p className="text-2xl font-black text-forest mt-1">
                {toBengaliDigits(calculatedFCR || 6.0)}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                সন্তোষজনক পুষ্টি স্তর
              </p>
            </div>
          </div>

          {/* Animals Quick Preview */}
          <div className="bg-white p-5 rounded-2xl border border-softBorder">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-forest-dark">পশু স্বাস্থ্য ও ট্যাগ রেকর্ড</h3>
              <button onClick={() => setActiveTab('animals')} className="text-xs font-bold text-forest hover:underline">
                সবগুলো দেখুন ({animals.length})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-rice text-secondaryText border-y border-softBorder">
                    <th className="py-2.5 px-3">ট্যাগ নম্বর</th>
                    <th className="py-2.5 px-3">জাত (Breed)</th>
                    <th className="py-2.5 px-3">বয়স ও লিঙ্গ</th>
                    <th className="py-2.5 px-3">ওজন</th>
                    <th className="py-2.5 px-3">স্বাস্থ্য স্ট্যাটাস</th>
                    <th className="py-2.5 px-3">বিশেষ তথ্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-softBorder">
                  {animals.map((anm) => (
                    <tr key={anm.id} className="hover:bg-warmWhite">
                      <td className="py-2.5 px-3 font-mono font-bold text-forest-dark">{anm.tagNumber}</td>
                      <td className="py-2.5 px-3 font-semibold">{anm.breed}</td>
                      <td className="py-2.5 px-3 text-secondaryText">{toBengaliDigits(anm.ageMonths)} মাস • {anm.gender}</td>
                      <td className="py-2.5 px-3 font-bold text-primaryText">{toBengaliDigits(anm.weightKg)} কেজি</td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={anm.healthStatus} size="sm" />
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-mutedText">{anm.notes || 'স্বাভাবিক'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY FARMS */}
      {activeTab === 'farms' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {livestockFarms.map((farm) => (
              <div key={farm.id} className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 uppercase">
                        {farm.livestockType}
                      </span>
                      <h4 className="text-base font-bold text-forest-dark mt-1">{farm.name}</h4>
                      <p className="text-xs text-secondaryText">{farm.purpose} • {farm.upazila}, {farm.district}</p>
                    </div>
                    <button
                      onClick={() => setDeleteTargetFarmId(farm.id)}
                      className="p-1.5 text-secondaryText hover:text-status-error hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-softBorder text-xs">
                    <div className="p-2 rounded-xl bg-rice">
                      <span className="text-[10px] text-secondaryText block">বর্তমান পশু</span>
                      <span className="font-bold text-primaryText">{toBengaliDigits(farm.animalCount)} টি</span>
                    </div>
                    <div className="p-2 rounded-xl bg-rice">
                      <span className="text-[10px] text-secondaryText block">শেড ধারণক্ষমতা</span>
                      <span className="font-bold text-primaryText">{toBengaliDigits(farm.capacity)} টি</span>
                    </div>
                    <div className="p-2 rounded-xl bg-rice">
                      <span className="text-[10px] text-secondaryText block">উপলব্ধ জায়গা</span>
                      <span className="font-bold text-primaryText">{toBengaliDigits(farm.availableSpaceSqFt)} বর্গফুট</span>
                    </div>
                    <div className="p-2 rounded-xl bg-rice">
                      <span className="text-[10px] text-secondaryText block">মাসিক আনুমানিক ব্যয়</span>
                      <span className="font-bold text-primaryText">{toBengaliDigits(farm.monthlyOperatingCost)} ৳</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-softBorder flex items-center justify-between">
                  <span className="text-[11px] text-mutedText">আপডেট: {farm.lastUpdated}</span>
                  <button
                    onClick={() => {
                      setSelectedFarmId(farm.id);
                      setShowAnimalModal(true);
                    }}
                    className="text-xs font-bold text-amber-900 hover:underline"
                  >
                    + নতুন পশু রেজিস্টার
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ANIMALS MANAGEMENT */}
      {activeTab === 'animals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-forest-dark">সকল রেজিস্টার্ড পশুর প্রোফাইল</h3>
            <button
              onClick={() => setShowAnimalModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-900 text-white text-xs font-bold hover:bg-amber-800 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>পশু যুক্ত করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {animals.map((anm) => (
              <div key={anm.id} className="p-4 rounded-2xl bg-white border border-softBorder shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-black text-forest-dark bg-rice px-2 py-0.5 rounded-md">
                      {anm.tagNumber}
                    </span>
                    <h4 className="text-xs font-bold text-primaryText mt-1.5">{anm.breed}</h4>
                  </div>
                  <StatusBadge status={anm.healthStatus} size="sm" />
                </div>

                <div className="space-y-1 text-xs text-secondaryText">
                  <div className="flex justify-between">
                    <span>বয়স:</span>
                    <span className="font-semibold text-primaryText">{toBengaliDigits(anm.ageMonths)} মাস</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ওজন:</span>
                    <span className="font-bold text-primaryText">{toBengaliDigits(anm.weightKg)} কেজি</span>
                  </div>
                  <div className="flex justify-between">
                    <span>লিঙ্গ:</span>
                    <span className="font-semibold text-primaryText">{anm.gender === 'Female' ? 'মাদী / গাভী' : 'নর / ষাঁড়'}</span>
                  </div>
                  {anm.notes && (
                    <p className="p-2 rounded-lg bg-rice/70 text-[11px] text-primaryText mt-2">
                      {anm.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-softBorder flex items-center justify-between">
                  <button
                    onClick={() => {
                      setVacTag(anm.tagNumber);
                      setShowVacModal(true);
                    }}
                    className="text-[11px] font-bold text-forest hover:underline"
                  >
                    + টিকা শিডিউল
                  </button>
                  <button
                    onClick={() => deleteAnimal(anm.id)}
                    className="text-mutedText hover:text-status-error"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BREED GUIDE & COMPARISON */}
      {activeTab === 'breeds' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
            <h3 className="text-sm font-bold text-forest-dark mb-1">
              উন্নত জাত নির্বাচন নির্দেশিকা ও তুলনা
            </h3>
            <p className="text-xs text-secondaryText mb-5">
              বাংলাদেশের আবহাওয়ায় রোগ প্রতিরোধ ক্ষমতা, উৎপাদনশীলতা ও ব্যবস্থাপনা সুবিধার তুলনামূলক বিশ্লেষণ।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  nameBn: 'শাহীওয়াল সংকর (Sahiwal Cross)',
                  purpose: 'দুধ ও মাংস উভমুখী',
                  milkYield: '১২-১৮ লিটার / দিন',
                  climateSuitability: 'উচ্চ সহনশীল ও তাপ প্রতিরোধী',
                  management: 'মাঝারি বিনিয়োগ উপযোগী',
                  pros: 'রোগবালাই কম, কৃত্রিম প্রজননে চমৎকার ফলাফল।'
                },
                {
                  nameBn: 'রেড চিটাগাং ক্যাটল (RCC)',
                  purpose: 'খাঁটি দেশি দুগ্ধ ও প্রজনন',
                  milkYield: '৪-৬ লিটার / দিন (উচ্চ ফ্যাট)',
                  climateSuitability: 'শতভাগ স্থানীয় আবহাওয়া উপযোগী',
                  management: 'স্বল্প খরচে লালন-পালন সম্ভব',
                  pros: 'খাদ্য রূপান্তর দক্ষতা চমৎকার, স্থানীয় ঘাস খেয়েও বাঁচে।'
                },
                {
                  nameBn: 'ব্ল্যাক বেঙ্গল ছাগল (Black Bengal)',
                  purpose: 'বিশ্বমানের সুস্বাদু মাংস ও চামড়া',
                  milkYield: 'বাচ্চার জন্য পর্যাপ্ত',
                  climateSuitability: 'আর্দ্র ও উষ্ণ আবহাওয়ার সাথে খাপখায়',
                  management: 'অল্প পুঁজিতে দ্রুত বংশবৃদ্ধি',
                  pros: 'এক সাথে ২-৩টি বাচ্চা দেয়, রোগবালাই খুব কম।'
                }
              ].map((brd, i) => (
                <div key={i} className="p-4 rounded-2xl bg-warmWhite border border-softBorder space-y-2.5">
                  <h4 className="text-sm font-bold text-forest-dark">{brd.nameBn}</h4>
                  <div className="text-xs space-y-1 text-primaryText">
                    <p><span className="text-secondaryText">উদ্দেশ্য:</span> {brd.purpose}</p>
                    <p><span className="text-secondaryText">উৎপাদন ক্ষমতা:</span> <strong>{brd.milkYield}</strong></p>
                    <p><span className="text-secondaryText">আবহাওয়া উপযোগিতা:</span> {brd.climateSuitability}</p>
                    <p><span className="text-secondaryText">ব্যবস্থাপনা:</span> {brd.management}</p>
                  </div>
                  <p className="text-[11px] p-2 rounded-xl bg-forest-50 text-forest-dark">
                    <strong>সুবিধা:</strong> {brd.pros}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DAILY CARE & NUTRITION & FCR CALCULATOR */}
      {activeTab === 'nutrition' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* FCR Calculator Form */}
          <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-softBorder pb-3">
              <Calculator className="w-5 h-5 text-amber-900" />
              <h3 className="text-sm font-bold text-forest-dark">FCR (খাদ্য রূপান্তর অনুপাত) হিসাব</h3>
            </div>

            <p className="text-xs text-secondaryText">
              FCR = মোট ব্যবহৃত খাদ্য (কেজি) ÷ মোট অর্জিত ওজন (কেজি)
            </p>

            <div>
              <label className="block text-xs font-bold text-primaryText mb-1">মোট ব্যবহৃত খাদ্য (কেজি) *</label>
              <input
                type="number"
                min="1"
                value={fcrFeed}
                onChange={(e) => setFcrFeed(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-softBorder bg-warmWhite outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primaryText mb-1">মোট অর্জিত দৈহিক ওজন বৃদ্ধি (কেজি) *</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={fcrWeightGain}
                onChange={(e) => setFcrWeightGain(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-softBorder bg-warmWhite outline-none"
              />
            </div>

            <button
              onClick={handleCalculateFCR}
              className="w-full py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs shadow-sm transition"
            >
              FCR গণনা করুন ও সেভ করুন
            </button>

            {calculatedFCR !== null && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-xs text-secondaryText block">গণনাকৃত FCR সূচক</span>
                <span className="text-3xl font-black text-amber-900 mt-1 block">
                  {toBengaliDigits(calculatedFCR)}
                </span>
                <p className="text-[11px] text-amber-800 mt-1">
                  {calculatedFCR <= 7.0 
                    ? 'চমৎকার! খাদ্য ব্যবস্থাপনা ও ওজন বৃদ্ধির অনুপাত লাভজনক সীমার মধ্যে রয়েছে।' 
                    : 'সতর্কতা: FCR বেশি হচ্ছে। দানাদার খাদ্যের গুণমান পরীক্ষা করুন ও কৃমিনাশক দিন।'}
                </p>
              </div>
            )}
          </div>

          {/* Daily Nutrition & Feeding Logs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
              <h3 className="text-sm font-bold text-forest-dark mb-3">দৈনিক খাদ্য সরবরাহ ও FCR হিস্ট্রি</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-rice text-secondaryText border-y border-softBorder">
                      <th className="py-2.5 px-3">তারিখ</th>
                      <th className="py-2.5 px-3">খাদ্যের ধরন</th>
                      <th className="py-2.5 px-3">পরিমাণ (কেজি)</th>
                      <th className="py-2.5 px-3">ওজন লাভ (কেজি)</th>
                      <th className="py-2.5 px-3">হিসাবকৃত FCR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-softBorder">
                    {feedingLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-warmWhite">
                        <td className="py-2.5 px-3 font-semibold">{toBengaliDigits(log.date)}</td>
                        <td className="py-2.5 px-3">{log.feedType}</td>
                        <td className="py-2.5 px-3 font-bold">{toBengaliDigits(log.feedQuantityKg)} কেজি</td>
                        <td className="py-2.5 px-3">{toBengaliDigits(log.totalWeightGainKg)} কেজি</td>
                        <td className="py-2.5 px-3 font-bold text-amber-900">
                          {log.calculatedFCR > 0 ? toBengaliDigits(log.calculatedFCR) : 'ডেইরি নিরীক্ষণ'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 6: VACCINATION & DEWORMING TRACKER */}
      {activeTab === 'vaccines' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-forest-dark">টিকা ও কৃমিনাশক ট্র্যাকার</h3>
            <button
              onClick={() => setShowVacModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-forest text-white text-xs font-bold hover:bg-forest-dark transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>টিকা রেকর্ড যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaccinations.map((vac) => (
              <div key={vac.id} className="p-4 rounded-2xl bg-white border border-softBorder shadow-2xs space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-forest-dark">{vac.vaccineName}</h4>
                    <span className="text-[11px] text-mutedText font-mono">{vac.animalIdOrGroup}</span>
                  </div>
                  <StatusBadge status={vac.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-softBorder">
                  <div>
                    <span className="text-[10px] text-secondaryText block">প্রয়োগের তারিখ</span>
                    <span className="font-semibold">{toBengaliDigits(vac.administeredDate)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-secondaryText block">পরবর্তী বুস্টার ডোজ</span>
                    <span className="font-bold text-status-warning">{toBengaliDigits(vac.nextDueDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-secondaryText">চিকিৎসক: {vac.veterinarian}</span>
                  {vac.status !== 'completed' && (
                    <button
                      onClick={() => updateVaccinationStatus(vac.id, 'completed')}
                      className="px-2.5 py-1 rounded-lg bg-forest/10 hover:bg-forest text-forest hover:text-white font-bold transition"
                    >
                      ✓ প্রয়োগ সম্পন্ন করুন
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: AI VET ASSISTANT (Urgency detection, emergency escalation) */}
      {activeTab === 'aivet' && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-softBorder shadow-2xs overflow-hidden flex flex-col h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h3 className="text-sm font-bold">এআই ভেট সহকারী (AI Vet Assistant)</h3>
                <p className="text-[11px] text-warmWhite/80">পশু স্বাস্থ্য নিরীক্ষা ও প্রাথমিক চিকিৎসা পরামর্শ</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={vetAnimalSelect}
                onChange={(e) => setVetAnimalSelect(e.target.value as any)}
                className="px-2.5 py-1 text-xs rounded-lg bg-black/20 text-white border border-white/20 outline-none"
              >
                <option value="cattle">গরু / গাভী (Cattle)</option>
                <option value="goat">ছাগল (Goat)</option>
                <option value="poultry">হাঁস-মুরগি (Poultry)</option>
              </select>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-rice/30">
            {vetChatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-forest text-white rounded-br-xs'
                      : msg.isEmergency
                      ? 'bg-red-50 border border-status-error text-status-error rounded-bl-xs font-medium'
                      : 'bg-white border border-softBorder text-primaryText rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}

                  {msg.isEmergency && (
                    <div className="mt-3 pt-2 border-t border-status-error/30 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedVetForEmergency(experts.find(e => e.category === 'veterinary') || experts[1]);
                          setActiveTab('emergency');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-status-error text-white font-bold text-xs hover:bg-red-700 transition"
                      >
                        🚨 ডাক্তার কল করুন
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendVetAI} className="p-3 bg-white border-t border-softBorder flex items-center space-x-2">
            <input
              type="text"
              placeholder="পশুর অসুস্থতা ও লক্ষণ লিখুন (যেমন: হঠাৎ দুধ কমে গেছে এবং ক্ষুরে ঘা)..."
              value={vetInput}
              onChange={(e) => setVetInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-softBorder bg-warmWhite outline-none focus:border-amber-900"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs transition"
            >
              পাঠান
            </button>
          </form>
        </div>
      )}

      {/* TAB 8: EMERGENCY VET SUPPORT (Verified Doctors & Booking) */}
      {activeTab === 'emergency' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-status-error">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-status-error" />
              <span><strong>জরুরি সহায়তা হটলাইন:</strong> ১৬১২৩ (সরকারি প্রাণিসম্পদ জরুরি সেবা) অথবা সরাসরি নিচে থাকা চিকিৎসকদের সাথে অডিও/ভিডিও কলে যুক্ত হন।</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experts.filter(e => e.category === 'veterinary').map((vet) => (
              <div key={vet.id} className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs flex items-start space-x-4">
                <img src={vet.avatarUrl} alt={vet.name} className="w-16 h-16 rounded-2xl object-cover border border-softBorder shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-forest-dark">{vet.nameBn}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">ভেরিফাইড</span>
                  </div>
                  <p className="text-xs text-secondaryText font-medium mt-0.5">{vet.designationBn}</p>
                  <p className="text-[11px] text-mutedText mt-1">{vet.aboutBn}</p>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-softBorder">
                    <span className="text-xs font-bold text-amber-900">ফি: ৳ {toBengaliDigits(vet.consultationFee)}</span>
                    <button
                      onClick={() => {
                        bookConsultation({
                          expertId: vet.id,
                          expertName: vet.nameBn,
                          category: 'veterinary',
                          farmerId: 'usr_001',
                          farmerName: 'মো: রফিকুল ইসলাম',
                          farmerPhone: '01712345678',
                          sector: 'livestock',
                          topic: 'জরুরি পশু চিকিৎসা (Emergency Vet)',
                          urgency: 'emergency',
                          description: 'তাত্ক্ষণিক পশু অসুস্থতা নিরীক্ষা',
                          preferredDate: new Date().toISOString().split('T')[0],
                          preferredTime: 'NOW'
                        });
                      }}
                      className="px-4 py-1.5 rounded-xl bg-status-error hover:bg-red-700 text-white font-bold text-xs transition shadow-sm"
                    >
                      জরুরি কল শুরু করুন
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD FARM */}
      <Modal
        isOpen={showFarmModal}
        onClose={() => setShowFarmModal(false)}
        title="নতুন পশুর খামার যুক্ত করুন"
        maxWidth="md"
      >
        <form onSubmit={handleSaveFarm} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-primaryText mb-1">খামারের নাম *</label>
            <input
              type="text"
              required
              placeholder="যেমন: গ্রীন ভ্যালি ডেইরি শেড"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-primaryText mb-1">পশুর ধরন</label>
              <select
                value={livestockType}
                onChange={(e) => setLivestockType(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              >
                <option value="cattle">গরু / ডেইরি (Cattle)</option>
                <option value="goat">ছাগল (Goat)</option>
                <option value="poultry">পোল্ট্রি (Poultry)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">খামারের উদ্দেশ্য</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              >
                <option value="Dairy (দুগ্ধ)">দুগ্ধ খামার (Dairy)</option>
                <option value="Fattening (হৃষ্টপুষ্টকরণ)">মোটাতাজাকরণ (Fattening)</option>
                <option value="Breeding (প্রজনন)">প্রজনন (Breeding)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-primaryText mb-1">পশুর সংখ্যা</label>
              <input
                type="number"
                value={animalCount}
                onChange={(e) => setAnimalCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">শেডের আয়তন (বর্গফুট)</label>
              <input
                type="number"
                value={spaceSqFt}
                onChange={(e) => setSpaceSqFt(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-softBorder">
            <button
              type="button"
              onClick={() => setShowFarmModal(false)}
              className="px-4 py-2 font-semibold text-secondaryText"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-amber-900 rounded-xl hover:bg-amber-800 transition"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD ANIMAL */}
      <Modal
        isOpen={showAnimalModal}
        onClose={() => setShowAnimalModal(false)}
        title="নতুন পশুর একক নিবন্ধন (Tag ID)"
        maxWidth="md"
      >
        <form onSubmit={handleSaveAnimal} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-primaryText mb-1">ট্যাগ নম্বর (Tag ID) *</label>
            <input
              type="text"
              required
              placeholder="যেমন: COW-BD-045"
              value={tagNumber}
              onChange={(e) => setTagNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-primaryText mb-1">জাত (Breed)</label>
              <input
                type="text"
                value={animalBreed}
                onChange={(e) => setAnimalBreed(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">বয়স (মাস)</label>
              <input
                type="number"
                value={animalAge}
                onChange={(e) => setAnimalAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-primaryText mb-1">ওজন (কেজি)</label>
              <input
                type="number"
                value={animalWeight}
                onChange={(e) => setAnimalWeight(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">স্বাস্থ্য অবস্থা</label>
              <select
                value={animalHealth}
                onChange={(e) => setAnimalHealth(e.target.value)}
                className="w-full px-2 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              >
                <option value="healthy">সুস্থ (Healthy)</option>
                <option value="treatment">চিকিৎসাধীন (Treatment)</option>
                <option value="quarantine">কোয়ারেন্টাইন (Quarantine)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-softBorder">
            <button
              type="button"
              onClick={() => setShowAnimalModal(false)}
              className="px-4 py-2 font-semibold text-secondaryText"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-forest rounded-xl hover:bg-forest-dark transition"
            >
              নিবন্ধন সম্পন্ন
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD VACCINATION */}
      <Modal
        isOpen={showVacModal}
        onClose={() => setShowVacModal(false)}
        title="টিকা ও কৃমিনাশক শিডিউল রেকর্ড"
        maxWidth="md"
      >
        <form onSubmit={handleSaveVaccination} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-primaryText mb-1">টিকার নাম *</label>
            <input
              type="text"
              required
              value={vacName}
              onChange={(e) => setVacName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-primaryText mb-1">প্রয়োগের তারিখ</label>
              <input
                type="date"
                value={vacAdminDate}
                onChange={(e) => setVacAdminDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">পরবর্তী বুস্টার ডোজ</label>
              <input
                type="date"
                value={vacNextDate}
                onChange={(e) => setVacNextDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold text-primaryText mb-1">পশু চিকিৎসক</label>
            <input
              type="text"
              value={vacVet}
              onChange={(e) => setVacVet(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-softBorder outline-none bg-warmWhite"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-softBorder">
            <button
              type="button"
              onClick={() => setShowVacModal(false)}
              className="px-4 py-2 font-semibold text-secondaryText"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-forest rounded-xl hover:bg-forest-dark transition"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE FARM */}
      <ConfirmDialog
        isOpen={deleteTargetFarmId !== null}
        title="খামার রেকর্ড মুছে ফেলবেন?"
        message="এই খামার মুছে ফেললে সংশ্লিষ্ট তথ্য অপসারণ হবে। আপনি কি নিশ্চিত?"
        onConfirm={() => {
          if (deleteTargetFarmId) deleteLivestockFarm(deleteTargetFarmId);
          setDeleteTargetFarmId(null);
        }}
        onCancel={() => setDeleteTargetFarmId(null)}
      />

    </div>
  );
};
