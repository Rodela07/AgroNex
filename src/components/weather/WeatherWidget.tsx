import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  Sprout, 
  Beef, 
  Fish, 
  Thermometer, 
  ChevronRight,
  Info
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters';

export const WeatherWidget: React.FC = () => {
  const { language, user } = useApp();
  const [activeTab, setActiveTab] = useState<'agri' | 'livestock' | 'fisheries'>('agri');

  // Simulated live weather for user's district
  const weatherData = {
    temp: 28,
    condition: language === 'bn' ? 'আংশিক মেঘলা ও দমকা বাতাস' : 'Partly Cloudy & Breeze',
    humidity: 78,
    windKmh: 14,
    rainChance: 65,
    alertTitleBn: 'আগামী ৩৬ ঘণ্টার মধ্যে মাঝারি বৃষ্টিপাতের সম্ভাবনা',
    alertTitleEn: 'Moderate precipitation expected within 36 hours',
    forecast: [
      { dayBn: 'আজ', dayEn: 'Today', temp: '২৮° / ২১°', rain: '৬৫%', icon: CloudRain },
      { dayBn: 'কাল', dayEn: 'Tomorrow', temp: '২৬° / ২০°', rain: '৭৫%', icon: CloudRain },
      { dayBn: 'পরশু', dayEn: 'Day After', temp: '২৯° / ২২°', rain: '২০%', icon: Sun },
    ]
  };

  const advice = {
    agri: {
      titleBn: 'কৃষি সতর্কতা ও করণীয়',
      titleEn: 'Agriculture Advisory',
      itemsBn: [
        'উত্তর মাঠের বোরো ধান বা রবি ফসলে আজ ইউরিয়া ও পটাশ সার ছিটানো থেকে বিরত থাকুন (বৃষ্টিতে সার অপচয় রোধে)।',
        'উত্তোলিত আলু শুষ্ক স্থানে ত্রিপল দিয়ে ঢেকে সংরক্ষণ করুন।',
        'নিচু জমির সেচ ড্রেন পরিষ্কার রাখুন যাতে বৃষ্টির জল দ্রুত নিষ্কাশন হয়।'
      ],
      itemsEn: [
        'Postpone top-dressing Urea fertilizer to prevent leaching due to expected rainfall.',
        'Keep harvested potatoes under waterproof tarpaulin in a dry shed.',
        'Ensure drainage trenches are cleared to prevent waterlogging in low-lying plots.'
      ]
    },
    livestock: {
      titleBn: 'পশু ও খামার স্বাস্থ্য সতর্কতা',
      titleEn: 'Livestock Care Advisory',
      itemsBn: [
        'বাতাসের আর্দ্রতা বৃদ্ধি পাওয়ায় শেডের ফ্যান ও পর্যাপ্ত বায়ু চলাচল (ভেন্টিলেশন) নিশ্চিত করুন।',
        'খামারের মেঝে শুকনো ও জীবাণুমুক্ত রাখুন যাতে ক্ষুরারোগ বা ব্যাকটেরিয়ার সংক্রমণ না বাড়ে।',
        'বৃষ্টিতে ভিজে যাওয়া ভেজা ঘাস সরাসরি খাওয়াবেন না; রোদে শুকিয়ে বা সাইলেজ মিশিয়ে দিন।'
      ],
      itemsEn: [
        'Ensure good cross-ventilation in cattle sheds to avoid respiratory stress in high humidity.',
        'Keep shed bedding dry and dusted with lime to prevent foot rot outbreaks.',
        'Avoid feeding dripping wet grass directly; wilting before feeding is recommended.'
      ]
    },
    fisheries: {
      titleBn: 'মৎস্য চাষ সতর্কতা',
      titleEn: 'Fisheries Advisory',
      itemsBn: [
        'বৃষ্টি ও মেঘলা আবহাওয়ায় ভোরে পুকুরে দ্রবীভূত অক্সিজেন হ্রাস পেতে পারে; প্রয়োজনে এয়ারেটর চালান।',
        'আজ ভাসমান খাদ্যের পরিমাণ ২০-২৫% কম দিন যাতে অবশিষ্ট খাবার পচে অ্যামোনিয়া না বাড়ে।',
        'পুকুরের পাড়ের চারপাশ দিয়ে জাল বেষ্টনী ঠিক আছে কিনা পরীক্ষা করুন যাতে অতিবৃষ্টিতে মাছ উপচে না যায়।'
      ],
      itemsEn: [
        'Overcast weather reduces photosynthesis; run paddlewheel aerators before dawn.',
        'Reduce commercial pelleted feed by 20-25% to prevent uneaten waste & ammonia spike.',
        'Inspect surrounding boundary nets to avoid fish escape during flash pond overflows.'
      ]
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-softBorder shadow-xs overflow-hidden mb-6">
      {/* Weather Header */}
      <div className="bg-gradient-to-r from-forest-900 to-forest-dark text-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider text-forest-leaf font-bold">
                {language === 'bn' ? 'আঞ্চলিক কৃষি আবহাওয়া তথ্য' : 'Agro-Meteorological Intel'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-rice border border-white/15">
                {language === 'bn' ? 'ডেমো আবহাওয়া ফিড' : 'Simulated Feed'}
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1">
              {user.district}, {user.upazila}
            </h2>
            <p className="text-xs text-rice/80">{weatherData.condition}</p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-8 h-8 text-harvest" />
              <div>
                <span className="text-3xl font-extrabold tracking-tight">
                  {language === 'bn' ? toBengaliDigits(weatherData.temp) : weatherData.temp}°C
                </span>
                <p className="text-[11px] text-rice/70">
                  {language === 'bn' ? 'তাপমাত্রা' : 'Current Temp'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center border-l border-white/20 pl-4">
              <div>
                <Droplets className="w-4 h-4 text-sky-300 mx-auto" />
                <span className="text-xs font-bold block mt-0.5">
                  {language === 'bn' ? toBengaliDigits(weatherData.humidity) : weatherData.humidity}%
                </span>
                <span className="text-[10px] text-rice/70">{language === 'bn' ? 'আর্দ্রতা' : 'Humidity'}</span>
              </div>
              <div>
                <Wind className="w-4 h-4 text-teal-300 mx-auto" />
                <span className="text-xs font-bold block mt-0.5">
                  {language === 'bn' ? toBengaliDigits(weatherData.windKmh) : weatherData.windKmh} km/h
                </span>
                <span className="text-[10px] text-rice/70">{language === 'bn' ? 'বাতাস' : 'Wind'}</span>
              </div>
              <div>
                <CloudRain className="w-4 h-4 text-blue-300 mx-auto" />
                <span className="text-xs font-bold block mt-0.5">
                  {language === 'bn' ? toBengaliDigits(weatherData.rainChance) : weatherData.rainChance}%
                </span>
                <span className="text-[10px] text-rice/70">{language === 'bn' ? 'বৃষ্টি' : 'Rain'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Alert Banner */}
        <div className="mt-4 p-2.5 rounded-xl bg-harvest-dark/30 border border-harvest/40 flex items-center space-x-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-harvest shrink-0" />
          <span className="font-semibold text-warmWhite">
            {language === 'bn' ? weatherData.alertTitleBn : weatherData.alertTitleEn}
          </span>
        </div>
      </div>

      {/* Actionable Recommendations Tabs */}
      <div className="p-5">
        <div className="flex items-center justify-between border-b border-softBorder pb-3 mb-4">
          <span className="text-xs font-bold text-forest-dark uppercase tracking-wider">
            {language === 'bn' ? 'আবহাওয়া অনুযায়ী খাতভিত্তিক পরামর্শ' : 'Sector-Specific Actionable Advisories'}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('agri')}
              className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-lg transition ${
                activeTab === 'agri' ? 'bg-forest text-white' : 'text-secondaryText hover:bg-rice'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'কৃষি' : 'Agriculture'}</span>
            </button>
            <button
              onClick={() => setActiveTab('livestock')}
              className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-lg transition ${
                activeTab === 'livestock' ? 'bg-amber-800 text-white' : 'text-secondaryText hover:bg-rice'
              }`}
            >
              <Beef className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'পশু' : 'Livestock'}</span>
            </button>
            <button
              onClick={() => setActiveTab('fisheries')}
              className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-lg transition ${
                activeTab === 'fisheries' ? 'bg-river text-white' : 'text-secondaryText hover:bg-rice'
              }`}
            >
              <Fish className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'মৎস্য' : 'Fisheries'}</span>
            </button>
          </div>
        </div>

        {/* Tab Advisory Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(language === 'bn' ? advice[activeTab].itemsBn : advice[activeTab].itemsEn).map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-rice/60 border border-softBorder text-xs text-primaryText flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-forest/15 text-forest font-bold flex items-center justify-center shrink-0 text-[11px]">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        {/* 3-day micro forecast bar */}
        <div className="mt-4 pt-3 border-t border-softBorder/60 flex items-center justify-between text-xs text-secondaryText">
          <div className="flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-mutedText" />
            <span>{language === 'bn' ? 'কৃষি আবহাওয়া পূর্বাভাসের উৎস: বিএমডি (ডেমো সিমুলেশন)' : 'Agro-weather Source: BMD Simulated Feed'}</span>
          </div>
          <div className="flex items-center space-x-4">
            {weatherData.forecast.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center space-x-1.5">
                  <span className="font-semibold text-primaryText">{language === 'bn' ? f.dayBn : f.dayEn}:</span>
                  <Icon className="w-3.5 h-3.5 text-river" />
                  <span>{f.temp}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
