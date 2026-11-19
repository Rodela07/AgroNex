import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Stethoscope, 
  Search, 
  Star, 
  Calendar, 
  Clock, 
  Phone, 
  Video, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  FileText,
  Info
} from 'lucide-react';
import { ExpertProfile, ExpertSpecialization } from '../../types';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { toBengaliDigits, formatCurrency } from '../../utils/formatters';

export const ExpertsHub: React.FC = () => {
  const { language, user, experts, consultations, bookConsultation, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookingModalExpert, setBookingModalExpert] = useState<ExpertProfile | null>(null);

  // Form State
  const [topic, setTopic] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'emergency'>('normal');
  const [desc, setDesc] = useState('');
  const [prefDate, setPrefDate] = useState(new Date().toISOString().split('T')[0]);
  const [prefTime, setPrefTime] = useState('11:00 AM');

  // Simulated live consultation modal
  const [activeCallBooking, setActiveCallBooking] = useState<any | null>(null);

  const filteredExperts = experts.filter((e) => {
    const matchCat = selectedCategory === 'all' || e.category === selectedCategory;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.nameBn.includes(search) ||
                        e.designationBn.includes(search) ||
                        e.district.includes(search);
    return matchCat && matchSearch;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalExpert) return;

    bookConsultation({
      expertId: bookingModalExpert.id,
      expertName: bookingModalExpert.nameBn,
      category: bookingModalExpert.category,
      farmerId: user.id,
      farmerName: user.name,
      farmerPhone: user.phone,
      sector: bookingModalExpert.category === 'agriculturist' ? 'agriculture' : bookingModalExpert.category === 'veterinary' ? 'livestock' : 'fisheries',
      topic: topic || 'সাধারণ কৃষি ও খামার পরামর্শ',
      urgency,
      description: desc || 'মাঠপর্যায়ে পরামর্শের জন্য অনুরোধ।',
      preferredDate: prefDate,
      preferredTime: prefTime
    });

    setBookingModalExpert(null);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-forest-light text-forest">
            <Stethoscope className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-forest-dark">
              {language === 'bn' ? 'যাচাইকৃত বিশেষজ্ঞ নেটওয়ার্ক (Expert Network)' : 'Verified Expert Network'}
            </h1>
            <p className="text-xs text-secondaryText">
              {language === 'bn' 
                ? 'কৃষিবিদ, ভেটেরিনারি সার্জন ও মৎস্য বিজ্ঞানীদের সাথে সরাসরি অডিও/ভিডিও পরামর্শ' 
                : 'Connect with certified agronomists, veterinary doctors & fisheries scientists'}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-softBorder shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-mutedText" />
          <input
            type="text"
            placeholder="বিশেষজ্ঞের নাম, ডিগ্রি বা এলাকা দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-softBorder bg-warmWhite outline-none focus:border-forest"
          />
        </div>

        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'সকল বিশেষজ্ঞ' },
            { id: 'agriculturist', label: 'কৃষিবিদ (Crop)' },
            { id: 'veterinary', label: 'পশু চিকিৎসক (Vet)' },
            { id: 'fisheries', label: 'মৎস্য বিজ্ঞানী (Fisheries)' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat.id ? 'bg-forest text-white' : 'bg-rice text-secondaryText hover:text-primaryText'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredExperts.map((exp) => (
          <div key={exp.id} className="bg-white rounded-2xl border border-softBorder shadow-2xs p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start space-x-3">
                <img src={exp.avatarUrl} alt={exp.name} className="w-16 h-16 rounded-2xl object-cover border border-softBorder shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-bold text-forest-dark">{exp.nameBn}</h3>
                    {exp.verified && (
                      <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-800" title="BCS / BAU Verified">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-secondaryText font-medium mt-0.5">{exp.designationBn}</p>
                  <p className="text-[11px] text-mutedText">{exp.qualification}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-softBorder text-xs space-y-1.5 text-secondaryText">
                <div className="flex justify-between">
                  <span>অভিজ্ঞতা:</span>
                  <span className="font-semibold text-primaryText">{toBengaliDigits(exp.experienceYears)} বছর</span>
                </div>
                <div className="flex justify-between">
                  <span>জেলা / কর্মস্থল:</span>
                  <span className="font-semibold text-primaryText">{exp.district}</span>
                </div>
                <div className="flex justify-between">
                  <span>রেটিং ও পর্যালোচনা:</span>
                  <span className="font-bold text-harvest-dark">★ {exp.rating} ({exp.reviewsCount} রিভিউ)</span>
                </div>
                <p className="text-[11px] p-2 rounded-xl bg-rice text-primaryText mt-2">
                  {exp.aboutBn}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-softBorder flex items-center justify-between">
              <div>
                <span className="text-[10px] text-mutedText block">পরামর্শ ফি</span>
                <span className="text-sm font-bold text-forest">
                  ৳ {toBengaliDigits(exp.consultationFee)}
                </span>
              </div>
              <button
                onClick={() => setBookingModalExpert(exp)}
                className="px-4 py-2 rounded-xl bg-forest hover:bg-forest-dark text-white text-xs font-bold transition shadow-xs"
              >
                পরামর্শের জন্য বুক করুন
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Farmer's Past & Upcoming Consultations History */}
      <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-forest-dark">আমার পরামর্শ অ্যাপয়েন্টমেন্ট ও প্রেসক্রিপশন হিস্ট্রি</h3>
        {consultations.length === 0 ? (
          <p className="text-xs text-secondaryText py-2">কোনো অতীত পরামর্শ রেকর্ড নেই।</p>
        ) : (
          <div className="space-y-3">
            {consultations.map((cns) => (
              <div key={cns.id} className="p-4 rounded-xl border border-softBorder bg-warmWhite space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-forest-dark">{cns.expertName}</span>
                    <span className="text-[10px] uppercase font-bold text-mutedText">({cns.category})</span>
                  </div>
                  <StatusBadge status={cns.status} size="sm" />
                </div>

                <p className="text-secondaryText">বিষয়: <strong>{cns.topic}</strong> • {cns.description}</p>
                <p className="text-[11px] text-mutedText">তারিখ: {toBengaliDigits(cns.preferredDate)} • সময়: {cns.preferredTime}</p>

                {cns.prescription && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 mt-2 space-y-1">
                    <span className="font-bold block flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>ডাক্তারের প্রেসক্রিপশন ও নির্দেশনা:</span>
                    </span>
                    <p className="whitespace-pre-line text-[11px]">{cns.prescription}</p>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => setActiveCallBooking(cns)}
                    className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-bold rounded-lg bg-forest/10 text-forest hover:bg-forest hover:text-white transition"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>ভিডিও কনসালটেশন ইন্টারফেস দেখুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOOK CONSULTATION MODAL */}
      {bookingModalExpert && (
        <Modal
          isOpen={true}
          onClose={() => setBookingModalExpert(null)}
          title="বিশেষজ্ঞ পরামর্শ অ্যাপয়েন্টমেন্ট বুকিং"
          subtitle={`${bookingModalExpert.nameBn} • ${bookingModalExpert.designationBn}`}
          maxWidth="md"
        >
          <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
            <div className="p-2.5 rounded-xl bg-forest-50 border border-forest/20 text-forest-dark flex items-start space-x-2">
              <Info className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <p>
                <strong>স্বচ্ছতা:</strong> এটি ফ্রন্টএন্ড বুকিং ডেমো ইন্টারফেস। অ্যাপয়েন্টমেন্ট সফলভাবে আপনার কনসালটেশন হিস্ট্রিতে রেকর্ড হবে।
              </p>
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">পরামর্শের প্রধান বিষয় *</label>
              <input
                type="text"
                required
                placeholder="যেমন: ধানের পাতা পোড়া রোগের কারণ ও চিকিৎসা"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-primaryText mb-1">পছন্দের তারিখ</label>
                <input
                  type="date"
                  value={prefDate}
                  onChange={(e) => setPrefDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-primaryText mb-1">পছন্দের সময়</label>
                <select
                  value={prefTime}
                  onChange={(e) => setPrefTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none"
                >
                  <option value="10:00 AM">সকাল ১০:০০ টা</option>
                  <option value="11:30 AM">সকাল ১১:৩০ টা</option>
                  <option value="03:30 PM">বিকাল ০৩:৩০ টা</option>
                  <option value="05:00 PM">বিকাল ০৫:০০ টা</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">জরুরিতা (Urgency)</label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setUrgency('normal')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                    urgency === 'normal' ? 'bg-forest text-white border-forest' : 'bg-rice text-secondaryText'
                  }`}
                >
                  নিয়মিত পরামর্শ
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('emergency')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                    urgency === 'emergency' ? 'bg-status-error text-white border-status-error' : 'bg-rice text-secondaryText'
                  }`}
                >
                  জরুরি অবস্থা
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">সমস্যার বিস্তারিত বিবরণ</label>
              <textarea
                rows={3}
                placeholder="ফসলের বা পশুর লক্ষণ বিস্তারিত লিখুন..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-softBorder">
              <button
                type="button"
                onClick={() => setBookingModalExpert(null)}
                className="px-4 py-2 font-semibold text-secondaryText"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-forest hover:bg-forest-dark rounded-xl transition shadow-sm"
              >
                বুকিং সম্পন্ন করুন
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* SIMULATED LIVE VIDEO / AUDIO CONSULTATION UI */}
      {activeCallBooking && (
        <Modal
          isOpen={true}
          onClose={() => setActiveCallBooking(null)}
          title={`টেলিমেডিসিন কনসালটেশন — ${activeCallBooking.expertName}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="relative h-64 bg-forest-900 rounded-2xl overflow-hidden flex items-center justify-center text-white border border-softBorder">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-forest-leaf/30 border-2 border-forest-leaf flex items-center justify-center mx-auto animate-pulse">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-base font-bold">{activeCallBooking.expertName} এর সাথে সংযোগ স্থাপিত</h4>
                <p className="text-xs text-rice/80">নিরাপদ অ্যান্ড-টু-অ্যান্ড এনক্রিপ্টেড কৃষি পরামর্শ কল</p>
                <div className="flex items-center justify-center space-x-1 text-xs text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
                  <span>04:22 মিনিট সক্রিয়</span>
                </div>
              </div>

              {/* Floating Self Camera View */}
              <div className="absolute bottom-3 right-3 w-24 h-20 rounded-xl bg-forest-dark border-2 border-white/20 flex items-center justify-center text-[10px] text-white">
                আপনার ক্যামেরা
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rice text-xs space-y-1">
              <p><strong>কেস টপিক:</strong> {activeCallBooking.topic}</p>
              <p><strong>বিবরণ:</strong> {activeCallBooking.description}</p>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setActiveCallBooking(null)}
                className="px-6 py-2.5 rounded-xl bg-status-error hover:bg-red-700 text-white font-bold text-xs transition shadow-sm"
              >
                কল সমাপ্ত করুন
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
