import type { UserProfile, UserRole, SectorType } from '../types/index';

export interface DemoPersona {
  id: string;
  name: string;
  nameBn: string;
  role: UserRole;
  roleBn: string;
  category: 'farmer' | 'buyer' | 'expert' | 'admin';
  phone: string;
  avatar: string;
  district: string;
  upazila: string;
  descriptionBn: string;
  profile: UserProfile;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'persona_farmer_rafiqul',
    name: 'Md. Rafiqul Islam',
    nameBn: 'মো: রফিকুল ইসলাম',
    role: 'agri_farmer',
    roleBn: 'প্রান্তিক ফসল চাষি ও বিক্রেতা',
    category: 'farmer',
    phone: '01712345678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    district: 'Bogura',
    upazila: 'Shibganj',
    descriptionBn: '৪৫ শতাংশ জমিতে ব্রি-২৮ বোরো ধান ও মহাস্থানে আলু চাষী। সরাসরি আড়ত ও ক্রেতাদের কাছে বিক্রি করেন।',
    profile: {
      id: 'usr_001',
      name: 'মো: রফিকুল ইসলাম (Md. Rafiqul Islam)',
      phone: '01712345678',
      email: 'rafiqul.agri@agronex.bd',
      roles: ['agri_farmer', 'livestock_farmer', 'marketplace_seller'],
      sectors: ['agriculture', 'livestock', 'marketplace'],
      division: 'Rajshahi',
      district: 'Bogura',
      upazila: 'Shibganj',
      village: 'Gokul, Uttarpara',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      businessName: 'ইসলাম এগ্রো অ্যান্ড ডেইরি খামার (Islam Agro & Dairy)',
      joinedDate: '12 Jan 2024'
    }
  },
  {
    id: 'persona_livestock_kashem',
    name: 'Abul Kashem',
    nameBn: 'আবুল কাশেম',
    role: 'livestock_farmer',
    roleBn: 'ডেইরি ও গবাদিপশু খামারি',
    category: 'farmer',
    phone: '01812345678',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    district: 'Pabna',
    upazila: 'Santhia',
    descriptionBn: '২২টি শাহীওয়াল ও ফ্রিজিয়ান জাতের সংকর গাভী ও ষাঁড়ের খামার পরিচালক। দৈনিক ৮০ লিটার দুধ উৎপাদন।',
    profile: {
      id: 'usr_002',
      name: 'আবুল কাশেম (Abul Kashem)',
      phone: '01812345678',
      email: 'kashem.dairy@agronex.bd',
      roles: ['livestock_farmer', 'marketplace_seller'],
      sectors: ['livestock', 'marketplace'],
      division: 'Rajshahi',
      district: 'Pabna',
      upazila: 'Santhia',
      village: 'Kashinathpur',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      businessName: 'কাশেম ডেইরি অ্যান্ড ক্যাটল ফার্ম',
      joinedDate: '05 Mar 2024'
    }
  },
  {
    id: 'persona_fisheries_shahjahan',
    name: 'Md. Shahjahan',
    nameBn: 'মোঃ শাহজাহান',
    role: 'fish_farmer',
    roleBn: 'বাণিজ্যিক মৎস্য চাষি',
    category: 'farmer',
    phone: '01912345678',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    district: 'Mymensingh',
    upazila: 'Trishal',
    descriptionBn: '৩টি বড় বাণিজ্যিক পুকুরে রুই, কাতলা ও মনোসেক্স তেলাপিয়ার আধুনিক ৩-স্তর বিশিষ্ট মিশ্র চাষী।',
    profile: {
      id: 'usr_003',
      name: 'মোঃ শাহজাহান (Md. Shahjahan)',
      phone: '01912345678',
      email: 'shahjahan.fish@agronex.bd',
      roles: ['fish_farmer', 'marketplace_seller'],
      sectors: ['fisheries', 'marketplace'],
      division: 'Mymensingh',
      district: 'Mymensingh',
      upazila: 'Trishal',
      village: 'Balipara',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      businessName: 'শাহজাহান ফিশারিজ অ্যান্ড নার্সারি',
      joinedDate: '20 Feb 2024'
    }
  },
  {
    id: 'persona_buyer_mostafa',
    name: 'Haji Mostafa Bepari',
    nameBn: 'হাজী মোস্তফা ব্যাপারী',
    role: 'wholesale_buyer',
    roleBn: 'কাওরান বাজার আড়তদার ও পাইকারি ক্রেতা',
    category: 'buyer',
    phone: '01612345678',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    district: 'Dhaka',
    upazila: 'Tejgaon',
    descriptionBn: 'ঢাকা কাওরান বাজারের বিশিষ্ট পাইকারি ব্যবসায়ী। উত্তরবঙ্গের কৃষকদের কাছ থেকে সরাসরি ধান, গম ও ভুট্টা ক্রয় করেন।',
    profile: {
      id: 'usr_004',
      name: 'হাজী মোস্তফা ব্যাপারী (Haji Mostafa Bepari)',
      phone: '01612345678',
      email: 'mostafa.arat@agronex.bd',
      roles: ['wholesale_buyer', 'trader_aratdar'],
      sectors: ['marketplace'],
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Tejgaon',
      village: 'Kawran Bazar Arat Block C',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      businessName: 'মেসার্স মোস্তফা এন্টারপ্রাইজ ও আড়ত',
      joinedDate: '10 Jan 2024'
    }
  },
  {
    id: 'persona_expert_nazmul',
    name: 'Dr. Nazmul Haque (DVM)',
    nameBn: 'ডাঃ নাজমুল হক (ভেটেরিনারি সার্জন)',
    role: 'vet_doctor',
    roleBn: 'নিবন্ধিত ভেটেরিনারি সার্জন (BCS)',
    category: 'expert',
    phone: '01512345678',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    district: 'Dhaka',
    upazila: 'Sher-e-Bangla Nagar',
    descriptionBn: 'বিসিএস (প্রাণিসম্পদ) কর্মকর্তা ও বাংলাদেশ কৃষি বিশ্ববিদ্যালয় (BAU) থেকে স্নাতক। কৃষকদের টেলিমেডিসিন পরামর্শক।',
    profile: {
      id: 'usr_005',
      name: 'ডাঃ নাজমুল হক (Dr. Nazmul Haque, DVM)',
      phone: '01512345678',
      email: 'dr.nazmul.dvm@agronex.bd',
      roles: ['vet_doctor', 'agri_expert'],
      sectors: ['livestock', 'agriculture'],
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Sher-e-Bangla Nagar',
      village: 'Department of Livestock Services',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      businessName: 'কেন্দ্রীয় পশু হাসপাতাল ও টেলিমেডিসিন',
      joinedDate: '01 Jan 2024'
    }
  },
  {
    id: 'persona_admin_system',
    name: 'AgroNex Admin',
    nameBn: 'প্ল্যাটফর্ম অ্যাডমিন',
    role: 'admin',
    roleBn: 'সিস্টেম অ্যাডমিনিস্ট্রেটর ও মডারেটর',
    category: 'admin',
    phone: '01312345678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    district: 'Dhaka',
    upazila: 'Farmgate',
    descriptionBn: 'এগ্রোনেক্স সিস্টেম সুপারভাইজার। বিশেষজ্ঞ অনুমোদন, বাজারদর হালনাগাদ, নিরাপত্তা ও লিস্টিং মডারেশন নিয়ন্ত্রণ।',
    profile: {
      id: 'usr_006',
      name: 'সিস্টেম অ্যাডমিনিস্ট্রেটর (AgroNex Admin)',
      phone: '01312345678',
      email: 'admin@agronex.gov.bd',
      roles: ['admin'],
      sectors: ['agriculture', 'livestock', 'fisheries', 'marketplace'],
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Farmgate',
      village: 'BARC Complex, New Airport Road',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      businessName: 'বাংলাদেশ ডিজিটাল কৃষি ইকোসিস্টেম কর্তৃপক্ষ',
      joinedDate: '01 Jan 2024'
    }
  }
];

