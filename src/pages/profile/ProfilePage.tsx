import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Sprout, 
  Beef, 
  Fish, 
  ShoppingBag, 
  Check, 
  Save, 
  Trash2,
  Lock,
  Globe
} from 'lucide-react';
import { UserRole, SectorType } from '../../types';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshGeo';

export const ProfilePage: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    user, 
    updateUser, 
    lands, 
    livestockFarms, 
    ponds, 
    listings, 
    orders, 
    showToast 
  } = useApp();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email || '');
  const [district, setDistrict] = useState(user.district);
  const [upazila, setUpazila] = useState(user.upazila);
  const [village, setVillage] = useState(user.village);
  const [businessName, setBusinessName] = useState(user.businessName || '');

  const [userRoles, setUserRoles] = useState<UserRole[]>(user.roles);
  const [userSectors, setUserSectors] = useState<SectorType[]>(user.sectors);

  const selectedDistObj = BANGLADESH_DISTRICTS.find(d => d.name === district) || BANGLADESH_DISTRICTS[0];

  const handleToggleRole = (role: UserRole) => {
    setUserRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleToggleSector = (sec: SectorType) => {
    setUserSectors(prev => 
      prev.includes(sec) ? prev.filter(s => s !== sec) : [...prev, sec]
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      phone,
      email: email || undefined,
      district,
      upazila,
      village,
      businessName: businessName || undefined,
      roles: userRoles,
      sectors: userSectors
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-softBorder shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover border border-softBorder shrink-0" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-forest-dark">{user.name}</h1>
              {user.isVerified && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ✓ ভেরিফাইড
                </span>
              )}
            </div>
            <p className="text-xs text-secondaryText mt-0.5">
              {user.businessName || 'এগ্রোনেক্স ডিজিটাল সদস্য'} • যোগদান: {user.joinedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-secondaryText">ভাষা:</span>
          <button
            onClick={() => setLanguage('bn')}
            className={`px-3 py-1 text-xs font-bold rounded-lg ${language === 'bn' ? 'bg-forest text-white' : 'bg-rice text-secondaryText'}`}
          >
            বাংলা
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-bold rounded-lg ${language === 'en' ? 'bg-forest text-white' : 'bg-rice text-secondaryText'}`}
          >
            English
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">

        {/* Personal & Farm Identity */}
        <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-forest-dark border-b border-softBorder pb-3">
            ব্যক্তিগত ও বাণিজ্যিক পরিচিতি
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-primaryText mb-1">পূর্ণ নাম *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none focus:border-forest"
              />
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">মোবাইল নম্বর *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none focus:border-forest"
              />
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">ইমেইল (ঐচ্ছিক)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none focus:border-forest"
              />
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">খামার বা ব্যবসার নাম</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none focus:border-forest"
              />
            </div>
          </div>
        </div>

        {/* Geographic Location */}
        <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-forest-dark border-b border-softBorder pb-3">
            ভৌগোলিক অবস্থান (Location)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-primaryText mb-1">জেলা (District) *</label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  const found = BANGLADESH_DISTRICTS.find(d => d.name === e.target.value);
                  if (found && found.upazilas.length > 0) setUpazila(found.upazilas[0]);
                }}
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none"
              >
                {BANGLADESH_DISTRICTS.map(d => (
                  <option key={d.name} value={d.name}>{d.name} ({d.nameBn})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">উপজেলা (Upazila) *</label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none"
              >
                {selectedDistObj.upazilas.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">গ্রাম / চাতাল</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-softBorder bg-warmWhite outline-none"
              />
            </div>
          </div>
        </div>

        {/* Multi-Role Capabilities */}
        <div className="bg-white p-5 rounded-2xl border border-softBorder shadow-2xs space-y-4">
          <div className="border-b border-softBorder pb-3">
            <h3 className="text-sm font-bold text-forest-dark">বহুবিধ ভূমিকা ও সক্ষমতা (Multi-Role Capabilities)</h3>
            <p className="text-xs text-secondaryText">একজন ব্যবহারকারী কৃষক ও বিক্রেতা উভয় সক্ষমতায় কাজ করতে পারেন।</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 'agri_farmer', label: 'কৃষি কৃষক' },
              { id: 'livestock_farmer', label: 'পশুপালক / খামারি' },
              { id: 'fish_farmer', label: 'মৎস্য চাষী' },
              { id: 'marketplace_seller', label: 'মার্কেটপ্লেস বিক্রেতা' },
              { id: 'wholesale_buyer', label: 'পাইকারি ক্রেতা / আড়তদার' },
              { id: 'consumer', label: 'সাধারণ ভোক্তা' }
            ].map(r => {
              const isChecked = userRoles.includes(r.id as UserRole);
              return (
                <label 
                  key={r.id} 
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center space-x-2 transition ${
                    isChecked ? 'bg-forest-50 border-forest text-forest-dark font-bold' : 'bg-warmWhite border-softBorder text-primaryText'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleRole(r.id as UserRole)}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span>{r.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Asset Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-white rounded-xl border border-softBorder">
            <span className="text-[10px] text-mutedText block">জমি প্লট</span>
            <span className="text-lg font-bold text-forest">{lands.length} টি</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-softBorder">
            <span className="text-[10px] text-mutedText block">খামার শেড</span>
            <span className="text-lg font-bold text-amber-900">{livestockFarms.length} টি</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-softBorder">
            <span className="text-[10px] text-mutedText block">মৎস্য পুকুর</span>
            <span className="text-lg font-bold text-river">{ponds.length} টি</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-softBorder">
            <span className="text-[10px] text-mutedText block">বিজ্ঞাপিত পণ্য</span>
            <span className="text-lg font-bold text-clay">{listings.length} টি</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-white font-bold text-xs shadow-sm transition flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>প্রোফাইল পরিবর্তন সংরক্ষণ করুন</span>
          </button>
        </div>

      </form>

    </div>
  );
};
