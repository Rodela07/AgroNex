import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Stethoscope, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  User, 
  FileText, 
  Save, 
  PhoneCall, 
  Check, 
  X,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { ConsultationBooking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { toBengaliDigits } from '../../utils/formatters';

export const ExpertDashboard: React.FC = () => {
  const { language, user, consultations, updateConsultationStatus } = useApp();

  const [selectedCaseForPrescription, setSelectedCaseForPrescription] = useState<ConsultationBooking | null>(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');

  const pendingRequests = consultations.filter(c => c.status === 'pending');
  const activeCases = consultations.filter(c => c.status === 'confirmed');

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForPrescription) return;

    updateConsultationStatus(
      selectedCaseForPrescription.id,
      'completed',
      doctorNotes || 'কেস পরীক্ষা সম্পন্ন ও প্রেসক্রিপশন প্রদান করা হলো।',
      prescriptionText
    );

    setSelectedCaseForPrescription(null);
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
              {language === 'bn' ? 'বিশেষজ্ঞ চিকিৎসক ওয়ার্কস্পেস (Doctor Workspace)' : 'Expert Consultant Workspace'}
            </h1>
            <p className="text-xs text-secondaryText">
              কৃষকদের কনসালটেশন অনুরোধ গ্রহণ, টেলিমেডিসিন পরীক্ষা ও ডিজিটাল প্রেসক্রিপশন প্রদান
            </p>
          </div>
        </div>

        <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
          ✓ ডিউটিতে সক্রিয় (Online)
        </span>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-softBorder">
          <span className="text-xs text-secondaryText font-medium">অপেক্ষমাণ কনসালটেশন অনুরোধ</span>
          <p className="text-2xl font-black text-amber-900 mt-1">
            {toBengaliDigits(pendingRequests.length)} টি
          </p>
          <p className="text-[11px] text-mutedText mt-1">
            তাত্ক্ষণিক পর্যালোচনা ও সময় নির্ধারণ প্রয়োজন
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-softBorder">
          <span className="text-xs text-secondaryText font-medium">নিশ্চিতকৃত সক্রিয় অ্যাপয়েন্টমেন্ট</span>
          <p className="text-2xl font-black text-forest mt-1">
            {toBengaliDigits(activeCases.length)} টি
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            আজকের নির্ধারিত টেলিমেডিসিন শিডিউল
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-softBorder">
          <span className="text-xs text-secondaryText font-medium">মোট সমাপ্তকৃত কেস</span>
          <p className="text-2xl font-black text-forest-dark mt-1">
            {toBengaliDigits(consultations.filter(c => c.status === 'completed').length)} টি
          </p>
          <p className="text-[11px] text-mutedText mt-1">
            প্রেসক্রিপশন ও ফলোআপ রেকর্ড সংরক্ষিত
          </p>
        </div>
      </div>

      {/* Consultation Requests & Active Cases List */}
      <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-forest-dark">পরামর্শ আবেদন ও কেস ব্যবস্থাপনা</h3>

        <div className="space-y-3">
          {consultations.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl border border-softBorder bg-warmWhite space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-softBorder">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-forest-dark text-sm">{item.farmerName}</span>
                    <span className="text-mutedText">({item.farmerPhone})</span>
                    <StatusBadge status={item.status} size="sm" />
                    {item.urgency === 'emergency' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-status-error font-bold">
                        জরুরি
                      </span>
                    )}
                  </div>
                  <p className="text-secondaryText font-semibold mt-0.5">{item.topic}</p>
                </div>

                <div className="text-left sm:text-right text-[11px] text-mutedText">
                  <span>তারিখ: {item.preferredDate} • সময়: {item.preferredTime}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rice/60 text-secondaryText">
                <span className="font-bold text-primaryText block mb-0.5">কৃষকের সমস্যা বিবরণ:</span>
                {item.description}
              </div>

              {item.prescription && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <span className="font-bold block mb-1">প্রদত্ত প্রেসক্রিপশন:</span>
                  <p className="whitespace-pre-line text-[11px]">{item.prescription}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-[11px] text-mutedText">কেস আইডি: {item.id}</span>

                <div className="flex items-center space-x-2">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => updateConsultationStatus(item.id, 'confirmed')}
                      className="px-3 py-1.5 rounded-xl bg-forest text-white font-bold text-xs hover:bg-forest-dark transition"
                    >
                      ✓ আবেদন গ্রহণ ও নিশ্চিত করুন
                    </button>
                  )}

                  {item.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        setSelectedCaseForPrescription(item);
                        setPrescriptionText(item.prescription || '১. অ্যান্টিসেপটিক স্প্রে বা ড্রেসিং\n২. প্রয়োজনীয় অ্যান্টিবায়োটিক ডোজ\n৩. পর্যাপ্ত বিশুদ্ধ পানি ও পুষ্টিকর খাবার');
                        setDoctorNotes(item.notes || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-forest text-white font-bold text-xs hover:bg-forest-dark transition"
                    >
                      প্রেসক্রিপশন লিখুন ও কেস সম্পন্ন করুন
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WRITE DIGITAL PRESCRIPTION MODAL */}
      {selectedCaseForPrescription && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCaseForPrescription(null)}
          title="ডিজিটাল প্রেসক্রিপশন ও পরামর্শ প্রদান"
          subtitle={`কৃষক: ${selectedCaseForPrescription.farmerName} • বিষয়: ${selectedCaseForPrescription.topic}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSavePrescription} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-primaryText mb-1">চিকিৎসকের নিরীক্ষা নোট (Clinical Findings)</label>
              <textarea
                rows={2}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="রোগের লক্ষণ ও শারীরিক অবস্থা পর্যালোচনা..."
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">প্রেসক্রিপশন ও ওষুধের মাত্রা *</label>
              <textarea
                rows={5}
                required
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                placeholder="১. ওষুধের নাম ও প্রয়োগ মাত্রা&#10;২. ব্যবহারের সঠিক নিয়ম&#10;৩. সতর্কতামূলক ব্যবস্থা..."
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none font-mono"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-softBorder">
              <button
                type="button"
                onClick={() => setSelectedCaseForPrescription(null)}
                className="px-4 py-2 font-semibold text-secondaryText"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-forest hover:bg-forest-dark rounded-xl transition shadow-sm"
              >
                প্রেসক্রিপশন ইস্যু করুন
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
