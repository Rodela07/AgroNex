import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Search, 
  Bell, 
  Plus, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Info, 
  AlertTriangle,
  Play,
  Trash2
} from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshGeo';
import { MarketPriceItem, PriceAlert, SectorType, ProduceUnit } from '../../types';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatNumber, toBengaliDigits } from '../../utils/formatters';

export const MarketPricesPage: React.FC = () => {
  const { 
    language, 
    marketPrices, 
    priceAlerts, 
    addPriceAlert, 
    togglePriceAlert, 
    deletePriceAlert, 
    simulatePriceUpdate 
  } = useApp();

  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected item for historical trend chart
  const [activeItemForChart, setActiveItemForChart] = useState<MarketPriceItem>(marketPrices[0]);

  // Price Alert Modal State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertProduct, setAlertProduct] = useState('ব্রি ধান-২৮ (ধান)');
  const [alertSector, setAlertSector] = useState<SectorType>('agriculture');
  const [alertDistrict, setAlertDistrict] = useState('Bogura');
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(1350);
  const [alertUnit, setAlertUnit] = useState<ProduceUnit>('maund');
  const [alertCondition, setAlertCondition] = useState<'at_or_above' | 'at_or_below'>('at_or_above');

  // Simulated price trigger test state
  const [simNewPrice, setSimNewPrice] = useState<number>(1360);

  const filteredPrices = marketPrices.filter((item) => {
    const matchSector = selectedSector === 'all' || item.sector === selectedSector;
    const matchDistrict = selectedDistrict === 'all' || item.district === selectedDistrict;
    const matchSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.productBn.includes(searchQuery) ||
                        item.marketLocation.includes(searchQuery);
    return matchSector && matchDistrict && matchSearch;
  });

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    addPriceAlert({
      userId: 'usr_001',
      productName: alertProduct,
      sector: alertSector,
      district: alertDistrict,
      targetPrice: Number(alertTargetPrice),
      unit: alertUnit,
      condition: alertCondition,
      isActive: true,
      currentObservedPrice: activeItemForChart.wholesalePrice,
      source: 'কৃষি বিপণন অধিদপ্তর (DAM Regional Hub)'
    });
    setShowAlertModal(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-harvest-light text-harvest-dark">
              <TrendingUp className="w-5 h-5 text-harvest-dark" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-forest-dark">
                {language === 'bn' ? 'আঞ্চলিক বাজার দর ও মূল্য বুদ্ধিমত্তা' : 'Regional Market Price Intelligence'}
              </h1>
              <p className="text-xs text-secondaryText">
                {language === 'bn' 
                  ? 'কৃষি বিপণন অধিদপ্তর (DAM) ও স্থানীয় পাইকারি আড়তের সংগৃহীত পাইকারি ও খুচরা দর' 
                  : 'Wholesale & retail price intelligence across Bangladeshi regional hubs'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAlertModal(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-white font-bold text-xs shadow-sm transition"
        >
          <Bell className="w-4 h-4 text-emerald-300" />
          <span>{language === 'bn' ? 'মূল্য সতর্কবার্তা (Alert) সেট করুন' : 'Create Price Alert'}</span>
        </button>
      </div>

      {/* Data Source Honest Disclosure Banner */}
      <div className="p-3 rounded-xl bg-forest-50 border border-forest/20 text-xs text-forest-dark flex items-start space-x-2">
        <Info className="w-4 h-4 text-forest shrink-0 mt-0.5" />
        <p>
          <strong>{language === 'bn' ? 'স্বচ্ছতার নীতি:' : 'Notice:'}</strong>{' '}
          {language === 'bn' 
            ? 'প্রদর্শিত বাজার দরসমূহ প্রদর্শনী ডেমো ডেটা হিসেবে কৃষি বিপণন অধিদপ্তরের কাঠামোর সাথে মিল রেখে সাজানো। কোনো লাইভ এপিআই সংযুক্ত না থাকায় এগুলোকে প্রকৃত বাণিজ্যিক নিশ্চয়তা হিসেবে গণ্য না করার অনুরোধ করা হচ্ছে।' 
            : 'Market prices shown reflect simulated regional wholesale benchmarks based on Department of Agricultural Marketing (DAM) reporting.'}
        </p>
      </div>

      {/* Historical Trend Chart Panel */}
      <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-softBorder pb-3">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-harvest-light text-harvest-dark uppercase">
              {activeItemForChart.category} • {activeItemForChart.district}
            </span>
            <h3 className="text-base font-bold text-forest-dark mt-1">
              {language === 'bn' ? activeItemForChart.productBn : activeItemForChart.product} — ৭ দিনের বাজার দর প্রবণতা
            </h3>
            <p className="text-xs text-secondaryText">
              আড়ত: {activeItemForChart.marketLocation} • সূত্র: {activeItemForChart.source}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-[10px] text-mutedText block">বর্তমান পাইকারি দর</span>
              <span className="text-xl font-black text-forest">
                {formatCurrency(activeItemForChart.wholesalePrice, language)}
              </span>
              <span className="text-[10px] text-secondaryText"> / {activeItemForChart.unit}</span>
            </div>
            <div className="text-right border-l border-softBorder pl-4">
              <span className="text-[10px] text-mutedText block">খুচরা বাজার দর</span>
              <span className="text-xl font-bold text-primaryText">
                {formatCurrency(activeItemForChart.retailPrice, language)}
              </span>
              <span className="text-[10px] text-secondaryText"> / {activeItemForChart.unit}</span>
            </div>
          </div>
        </div>

        {/* Responsive Custom SVG Trend Chart */}
        <div className="h-44 w-full pt-4">
          <div className="h-32 flex items-end justify-between gap-2 px-4 border-b border-l border-softBorder relative">
            {activeItemForChart.historicalTrend.map((t, idx) => {
              const maxP = Math.max(...activeItemForChart.historicalTrend.map(x => x.price)) * 1.05;
              const minP = Math.min(...activeItemForChart.historicalTrend.map(x => x.price)) * 0.95;
              const range = maxP - minP || 1;
              const heightPct = Math.max(15, Math.min(95, ((t.price - minP) / range) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition text-[10px] font-bold bg-forest text-white px-1.5 py-0.5 rounded shadow mb-1">
                    ৳{toBengaliDigits(t.price)}
                  </div>
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[36px] bg-gradient-to-t from-forest to-forest-leaf rounded-t-lg transition-all duration-300 group-hover:from-forest-dark group-hover:to-harvest"
                  />
                  <span className="text-[10px] text-mutedText font-semibold mt-2">
                    {t.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-softBorder shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-mutedText" />
            <input
              type="text"
              placeholder="পণ্য বা আড়তের নাম দিয়ে ফিল্টার করুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-softBorder bg-warmWhite outline-none focus:border-forest"
            />
          </div>

          <div className="flex space-x-2">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-softBorder bg-warmWhite outline-none"
            >
              <option value="all">সকল সেক্টর</option>
              <option value="agriculture">কৃষি ফসল</option>
              <option value="livestock">পশু ও ডেইরি</option>
              <option value="fisheries">মাছ</option>
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-softBorder bg-warmWhite outline-none"
            >
              <option value="all">সকল জেলা</option>
              {BANGLADESH_DISTRICTS.map(d => (
                <option key={d.name} value={d.name}>{d.name} ({d.nameBn})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Market Price Table */}
      <div className="bg-white rounded-2xl border border-softBorder shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-rice border-b border-softBorder text-secondaryText">
                <th className="py-3 px-4 font-bold">পণ্য ও জাত</th>
                <th className="py-3 px-4 font-bold">পাইকারি বাজার দর</th>
                <th className="py-3 px-4 font-bold">খুচরা মূল্য</th>
                <th className="py-3 px-4 font-bold">দৈনিক রেঞ্জ (মিন - ম্যাক্স)</th>
                <th className="py-3 px-4 font-bold">বাজার ও জেলা</th>
                <th className="py-3 px-4 font-bold">সর্বশেষ আপডেট</th>
                <th className="py-3 px-4 font-bold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-softBorder">
              {filteredPrices.map((item) => {
                const isSelected = activeItemForChart.id === item.id;
                return (
                  <tr 
                    key={item.id} 
                    className={`transition cursor-pointer ${isSelected ? 'bg-forest/5 font-semibold' : 'hover:bg-warmWhite'}`}
                    onClick={() => setActiveItemForChart(item)}
                  >
                    <td className="py-3 px-4">
                      <span className="font-bold text-forest-dark block">
                        {language === 'bn' ? item.productBn : item.product}
                      </span>
                      <span className="text-[10px] text-mutedText uppercase">{item.sector} • {item.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-black text-forest">
                        ৳ {toBengaliDigits(item.wholesalePrice)}
                      </span>
                      <span className="text-[10px] text-secondaryText"> / {item.unit}</span>
                    </td>
                    <td className="py-3 px-4 text-primaryText font-semibold">
                      ৳ {toBengaliDigits(item.retailPrice)} / {item.unit}
                    </td>
                    <td className="py-3 px-4 text-secondaryText text-[11px]">
                      ৳{toBengaliDigits(item.minPrice)} - ৳{toBengaliDigits(item.maxPrice)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-primaryText block">{item.marketLocation}</span>
                      <span className="text-[10px] text-mutedText">{item.district}</span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-mutedText">
                      {item.recordedTimestamp}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAlertProduct(item.productBn);
                          setAlertSector(item.sector);
                          setAlertDistrict(item.district);
                          setAlertTargetPrice(item.wholesalePrice);
                          setAlertUnit(item.unit);
                          setShowAlertModal(true);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-harvest-light text-harvest-dark hover:bg-harvest/30 transition"
                      >
                        + অ্যালার্ট
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User's Price Alerts Management & Test Simulation Bar */}
      <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-softBorder gap-2">
          <div>
            <h3 className="text-sm font-bold text-forest-dark flex items-center space-x-1.5">
              <Bell className="w-4 h-4 text-harvest-dark" />
              <span>আমার সক্রিয় মূল্য সতর্কবার্তা তালিকা ({priceAlerts.length})</span>
            </h3>
            <p className="text-xs text-secondaryText">
              নির্দিষ্ট পণ্যের বাজার দর আপনার কাঙ্ক্ষিত সীমাতে পৌঁছালে অ্যাপ নোটিফিকেশন পাবেন।
            </p>
          </div>

          {/* Test Trigger Simulation Input */}
          <div className="flex items-center space-x-2 bg-rice p-2 rounded-xl">
            <span className="text-[11px] text-secondaryText font-semibold">সিমুলেটেড টেস্ট:</span>
            <input
              type="number"
              value={simNewPrice}
              onChange={(e) => setSimNewPrice(Number(e.target.value))}
              className="w-20 px-2 py-1 text-xs rounded border border-softBorder bg-white"
            />
            <button
              onClick={() => simulatePriceUpdate('ধান', simNewPrice)}
              className="px-3 py-1 text-xs font-bold bg-forest text-white rounded-lg hover:bg-forest-dark transition flex items-center space-x-1"
            >
              <Play className="w-3 h-3" />
              <span>দর পরীক্ষা</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {priceAlerts.map((alt) => (
            <div key={alt.id} className="p-3.5 rounded-xl border border-softBorder bg-warmWhite space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-forest-dark">{alt.productName}</span>
                <button
                  onClick={() => togglePriceAlert(alt.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    alt.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {alt.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </button>
              </div>

              <div className="text-[11px] text-secondaryText space-y-0.5">
                <p>লক্ষ্যমাত্রা: <strong>{alt.condition === 'at_or_above' ? '≥' : '≤'} ৳{toBengaliDigits(alt.targetPrice)}</strong> / {alt.unit}</p>
                <p>বর্তমান আড়ত দর: ৳{toBengaliDigits(alt.currentObservedPrice)}</p>
                <p className="text-mutedText">অবস্থান: {alt.district}</p>
              </div>

              <div className="pt-2 border-t border-softBorder flex justify-end">
                <button
                  onClick={() => deletePriceAlert(alt.id)}
                  className="text-mutedText hover:text-status-error text-[11px] flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>মুছে ফেলুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE PRICE ALERT MODAL */}
      <Modal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="নতুন মূল্য সতর্কবার্তা (Price Alert) তৈরি করুন"
        maxWidth="md"
      >
        <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-primaryText mb-1">পণ্যের নাম *</label>
            <input
              type="text"
              required
              value={alertProduct}
              onChange={(e) => setAlertProduct(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">টার্গেট মূল্য (টাকা) *</label>
              <input
                type="number"
                required
                value={alertTargetPrice}
                onChange={(e) => setAlertTargetPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none font-bold text-forest"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">পরিমাপ একক</label>
              <select
                value={alertUnit}
                onChange={(e) => setAlertUnit(e.target.value as ProduceUnit)}
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none font-bold"
              >
                <option value="maund">মণ (Maund)</option>
                <option value="kg">কেজি (Kg)</option>
                <option value="quintal">কুইন্টাল (Quintal)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-primaryText mb-1">সতর্কবার্তা শর্ত (Alert Condition)</label>
            <select
              value={alertCondition}
              onChange={(e) => setAlertCondition(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none"
            >
              <option value="at_or_above">বাজার দর টার্গেট মূল্যের সমান বা বেশি হলে (At or Above)</option>
              <option value="at_or_below">বাজার দর টার্গেট মূল্যের সমান বা কম হলে (At or Below)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-primaryText mb-1">জেলা নির্বাচন</label>
            <select
              value={alertDistrict}
              onChange={(e) => setAlertDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none"
            >
              {BANGLADESH_DISTRICTS.map(d => (
                <option key={d.name} value={d.name}>{d.name} ({d.nameBn})</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-softBorder">
            <button
              type="button"
              onClick={() => setShowAlertModal(false)}
              className="px-4 py-2 font-semibold text-secondaryText"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-forest hover:bg-forest-dark rounded-xl transition shadow-sm"
            >
              অ্যালার্ট চালু করুন
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
