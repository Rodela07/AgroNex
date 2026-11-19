import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_PERSONAS, DemoPersona } from '../../data/demoPersonas';
import { 
  Sprout, 
  Beef, 
  Fish, 
  ShoppingBag, 
  Stethoscope, 
  ShieldCheck, 
  Lock, 
  Phone, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Info, 
  HelpCircle,
  RefreshCw,
  Globe
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters';

interface LoginPageProps {
  onSuccess?: () => void;
  onOpenRegister?: () => void;
  onExploreAsGuest?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onSuccess, 
  onOpenRegister,
  onExploreAsGuest 
}) => {
  const { language, setLanguage, loginWithPhoneOtp, loginWithPassword, loginAsPersona, showToast } = useApp();

  // Mode: 'otp' | 'password' | 'personas'
  const [authMode, setAuthMode] = useState<'otp' | 'password' | 'personas'>('otp');

  // OTP Login State
  const [phoneNumber, setPhoneNumber] = useState('01712345678');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Login State
  const [identifier, setIdentifier] = useState('rafiqul.agri@agronex.bd');
  const [password, setPassword] = useState('agronex2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 11) {
      showToast(
        language === 'bn' ? 'সঠিক মোবাইল নম্বর দিন' : 'Enter valid phone number',
        'warning',
        language === 'bn' ? '১১-সংখ্যার বাংলাদেশী মোবাইল নম্বর আবশ্যক (যেমন: 017xxxxxxxx)' : '11-digit Bangladeshi mobile number required'
      );
      return;
    }
    setOtpSent(true);
    setCountdown(60);
    showToast(
      language === 'bn' ? 'ওটিপি কোড পাঠানো হয়েছে' : 'OTP Code Sent',
      'success',
      language === 'bn' ? 'পরীক্ষামূলক ডেমো ওটিপি কোড: 123456' : 'Simulated demo OTP code: 123456'
    );
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      showToast(
        language === 'bn' ? '৬-সংখ্যার কোড লিখুন' : 'Enter 6-digit code',
        'warning'
      );
      return;
    }

    setIsSubmitting(true);
    const success = await loginWithPhoneOtp(phoneNumber, fullOtp);
    setIsSubmitting(false);

    if (success && onSuccess) {
      onSuccess();
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      showToast(
        language === 'bn' ? 'সব তথ্য পূরণ করুন' : 'Fill all fields',
        'warning'
      );
      return;
    }

    setIsSubmitting(true);
    const success = await loginWithPassword(identifier, password);
    setIsSubmitting(false);

    if (success && onSuccess) {
      onSuccess();
    }
  };

  const handleSelectPersona = (persona: DemoPersona) => {
    loginAsPersona(persona.id);
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val[val.length - 1];
    }
    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-rice flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-forest/20 selection:text-forest-dark">
      
      {/* Top Header Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-4 border-b border-softBorder/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-forest flex items-center justify-center text-white shadow-xs">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-forest-leaf" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-forest-dark">
                Agro<span className="text-forest-leaf">Nex</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-forest-light text-forest rounded-full border border-forest/20">
                BD v2.0
              </span>
            </div>
            <p className="text-[11px] text-secondaryText hidden sm:block">
              {language === 'bn' ? 'সমন্বিত এগ্রো-টেক ও ডিরেক্ট মার্কেটপ্লেস' : 'Integrated Agro-Tech & Direct Marketplace'}
            </p>
          </div>
        </div>

        {/* Right language toggle */}
        <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded-xl border border-softBorder shadow-2xs">
          <Globe className="w-3.5 h-3.5 text-mutedText" />
          <button
            onClick={() => setLanguage('bn')}
            className={`px-2 py-0.5 text-xs font-bold rounded-lg transition ${
              language === 'bn' ? 'bg-forest text-white shadow-xs' : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            বাংলা
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 text-xs font-bold rounded-lg transition ${
              language === 'en' ? 'bg-forest text-white shadow-xs' : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            English
          </button>
        </div>
      </header>

      {/* Main Portal Container */}
      <main className="max-w-4xl mx-auto w-full my-6 sm:my-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Hero Card / Value Proposition */}
          <div className="lg:col-span-5 bg-gradient-to-br from-forest-dark via-forest to-forest-800 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-forest-leaf/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-harvest/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-forest-leaf border border-white/15 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'বাংলাদেশের আধুনিক কৃষি পোর্টাল' : 'Bangladesh Smart Agri Portal'}</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                  {language === 'bn' 
                    ? 'কৃষি, খামার ও বাজার—এক সাথে আপনার হাতের মুঠোয়' 
                    : 'Smart Farming, Livestock & Direct Marketplace in One Platform'}
                </h1>
                <p className="text-xs sm:text-sm text-rice/80 leading-relaxed">
                  {language === 'bn'
                    ? 'সরাসরি পাইকারি ক্রেতাদের সাথে সংযোগ, বিএআরসি অনুমোদিত সার গণনা, পশু স্বাস্থ্য কৃত্রিম বুদ্ধিমত্তা ও ৩-স্তর বিশিষ্ট মাছ চাষ।'
                    : 'Direct farmer-to-buyer sales, BARC nutrient calculation, AI livestock diagnosis and multi-species fisheries management.'}
                </p>
              </div>

              {/* Ecosystem 4 Sectors Pills */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/10 border border-white/10 text-xs">
                  <Sprout className="w-4 h-4 text-forest-leaf shrink-0" />
                  <span>{language === 'bn' ? '১. ফসল ও কৃষি' : '1. Crops & Land'}</span>
                </div>
                <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/10 border border-white/10 text-xs">
                  <Beef className="w-4 h-4 text-harvest-light shrink-0" />
                  <span>{language === 'bn' ? '২. গবাদিপশু খামার' : '2. Livestock'}</span>
                </div>
                <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/10 border border-white/10 text-xs">
                  <Fish className="w-4 h-4 text-river-light shrink-0" />
                  <span>{language === 'bn' ? '৩. মৎস্য চাষ' : '3. Fisheries'}</span>
                </div>
                <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/10 border border-white/10 text-xs">
                  <ShoppingBag className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{language === 'bn' ? '৪. সরাসরি বাজার' : '4. Marketplace'}</span>
                </div>
              </div>
            </div>

            {/* Bottom Trust Badge */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/15 text-[11px] text-rice/75 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-forest-leaf" />
                <span>{language === 'bn' ? 'নিরাপদ ও নির্ভরযোগ্য ডিজিটাল পোর্টাল' : 'Secure & Certified Digital System'}</span>
              </div>
              <p>
                {language === 'bn' 
                  ? 'কৃষি সম্প্রসারণ অধিদপ্তর ও প্রাণিসম্পদ নীতিমালার সাথে সামঞ্জস্যপূর্ণ' 
                  : 'Aligned with DAE, DLS & National Agricultural Advisory Framework'}
              </p>
            </div>
          </div>

          {/* Right Login Box */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-softBorder shadow-sm flex flex-col justify-between">
            <div>
              
              {/* Login Mode Tabs */}
              <div className="flex items-center p-1 rounded-2xl bg-rice border border-softBorder mb-6 gap-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('otp')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    authMode === 'otp'
                      ? 'bg-forest text-white shadow-xs'
                      : 'text-secondaryText hover:text-primaryText'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'মোবাইল ওটিপি' : 'Mobile OTP'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('password')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    authMode === 'password'
                      ? 'bg-forest text-white shadow-xs'
                      : 'text-secondaryText hover:text-primaryText'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('personas')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    authMode === 'personas'
                      ? 'bg-forest text-white shadow-xs'
                      : 'text-secondaryText hover:text-primaryText'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-harvest-dark" />
                  <span>{language === 'bn' ? 'ডেমো রোল' : 'Demo Personas'}</span>
                </button>
              </div>

              {/* MODE 1: MOBILE OTP LOGIN */}
              {authMode === 'otp' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-forest-dark">
                      {language === 'bn' ? 'মোবাইল নম্বর দিয়ে প্রবেশ করুন' : 'Sign in with Mobile Number'}
                    </h2>
                    <p className="text-xs text-secondaryText mt-0.5">
                      {language === 'bn' 
                        ? 'আপনার ১১-সংখ্যার বাংলাদেশী মোবাইল নম্বরে একটি ৬-সংখ্যার যাচাইকরণ কোড পাঠানো হবে।' 
                        : 'A 6-digit verification code will be sent to your Bangladeshi mobile phone.'}
                    </p>
                  </div>

                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-primaryText mb-1.5">
                          {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Phone Number'}
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 flex items-center space-x-1 pr-2 border-r border-softBorder text-xs font-bold text-secondaryText">
                            <span>🇧🇩 +88</span>
                          </div>
                          <input
                            type="tel"
                            required
                            placeholder="01712345678"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="input-field pl-20 text-sm font-semibold tracking-wider"
                          />
                        </div>
                        <span className="text-[11px] text-mutedText mt-1 block">
                          {language === 'bn' ? 'গ্রামীণফোন, বাংলালিংক, রবি, এয়ারটেল বা টেলিটক' : 'Grameenphone, Banglalink, Robi, Airtel or Teletalk'}
                        </span>
                      </div>

                      {/* Demo Notice Banner */}
                      <div className="p-3 rounded-xl bg-forest-50 border border-forest/20 text-xs text-forest-dark flex items-start space-x-2">
                        <Info className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                        <div>
                          <strong>{language === 'bn' ? 'সিমুলেটেড ডেমো পরিবেশ:' : 'Demo Environment:'}</strong>
                          <p className="text-[11px] text-secondaryText mt-0.5">
                            {language === 'bn' 
                              ? 'যেকোনো নম্বরে সরাসরি ওটিপি পাঠানো যাবে। পরীক্ষার জন্য ডিফল্ট কোড: 123456' 
                              : 'Live telecom gateway simulated. Default demo code: 123456'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn-primary w-full py-3 text-sm font-bold shadow-sm"
                      >
                        <span>{language === 'bn' ? 'ওটিপি কোড পাঠান' : 'Send Verification OTP'}</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-secondaryText">
                          {language === 'bn' ? 'প্রেরিত নম্বর:' : 'Sent to:'} <strong>+88 {phoneNumber}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-xs text-forest font-bold hover:underline"
                        >
                          {language === 'bn' ? 'নম্বর পরিবর্তন' : 'Change Number'}
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-primaryText mb-2 text-center">
                          {language === 'bn' ? '৬-সংখ্যার ওটিপি কোডটি লিখুন' : 'Enter 6-Digit OTP Code'}
                        </label>
                        <div className="flex justify-center gap-2 sm:gap-2.5">
                          {otpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              id={`otp-input-${idx}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              className="w-10 h-12 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-black rounded-xl border border-softBorder bg-warmWhite focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Prefilled Demo Banner */}
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-center font-medium">
                        {language === 'bn' ? '💡 ডেমো কোড ' : '💡 Demo Code '}
                        <strong className="tracking-widest font-black text-forest">123456</strong>
                        {language === 'bn' ? ' স্বয়ংক্রিয়ভাবে প্রদান করা আছে' : ' prefilled for convenience'}
                      </div>

                      <div className="flex items-center justify-between text-xs text-secondaryText">
                        <span>
                          {countdown > 0 ? (
                            <span>{language === 'bn' ? `পুনরায় পাঠানো যাবে: ${toBengaliDigits(countdown)} সেকেন্ড` : `Resend in: ${countdown}s`}</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setCountdown(60);
                                showToast(language === 'bn' ? 'নতুন ওটিপি কোড পাঠানো হয়েছে: 123456' : 'New OTP Sent: 123456', 'info');
                              }}
                              className="text-forest font-bold hover:underline flex items-center space-x-1"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'পুনরায় ওটিপি পাঠান' : 'Resend OTP'}</span>
                            </button>
                          )}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full py-3 text-sm font-bold shadow-sm"
                      >
                        {isSubmitting ? (
                          <span>{language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                        ) : (
                          <>
                            <span>{language === 'bn' ? 'যাচাই সম্পন্ন করে প্রবেশ করুন' : 'Verify & Sign In'}</span>
                            <ArrowRight className="w-4 h-4 ml-1.5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* MODE 2: PASSWORD LOGIN */}
              {authMode === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-forest-dark">
                      {language === 'bn' ? 'পাসওয়ার্ড দিয়ে লগইন' : 'Sign In with Password'}
                    </h2>
                    <p className="text-xs text-secondaryText mt-0.5">
                      {language === 'bn' 
                        ? 'আপনার নিবন্ধিত মোবাইল নম্বর বা ইমেইল এবং পাসওয়ার্ড প্রদান করুন।' 
                        : 'Enter your registered mobile or email and account password.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primaryText mb-1.5">
                      {language === 'bn' ? 'মোবাইল নম্বর অথবা ইমেইল' : 'Mobile Number or Email'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-mutedText" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="017xxxxxxxx or name@agronex.bd"
                        className="input-field pl-10 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-primaryText">
                        {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] text-forest font-bold hover:underline"
                      >
                        {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-mutedText" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-field pl-10 pr-10 text-xs sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-mutedText hover:text-primaryText"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-forest focus:ring-forest/20 border-softBorder"
                    />
                    <label htmlFor="rememberMe" className="text-secondaryText cursor-pointer">
                      {language === 'bn' ? 'আমাকে মনে রাখুন' : 'Remember me on this device'}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3 text-sm font-bold shadow-sm"
                  >
                    <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </form>
              )}

              {/* MODE 3: 1-CLICK DEMO PERSONAS */}
              {authMode === 'personas' && (
                <div className="space-y-3">
                  <div>
                    <h2 className="text-lg font-bold text-forest-dark">
                      {language === 'bn' ? 'এক ক্লিকে ডেমো রোলে প্রবেশ' : '1-Click Demo Personas'}
                    </h2>
                    <p className="text-xs text-secondaryText mt-0.5">
                      {language === 'bn' 
                        ? 'কোনো ফোন নম্বর না লিখেই প্ল্যাটফর্মের বিভিন্ন ব্যবহারকারী চরিত্র হিসেবে অভিজ্ঞতা নিন:' 
                        : 'Explore distinct multi-role experiences instantly without typing phone numbers:'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {DEMO_PERSONAS.map((persona) => (
                      <button
                        key={persona.id}
                        type="button"
                        onClick={() => handleSelectPersona(persona)}
                        className="p-3 rounded-2xl border border-softBorder bg-warmWhite hover:bg-forest-50/70 hover:border-forest/40 transition text-left flex items-start space-x-3 group cursor-pointer shadow-2xs"
                      >
                        <img 
                          src={persona.avatar} 
                          alt={persona.name} 
                          className="w-11 h-11 rounded-xl object-cover border border-softBorder shrink-0 group-hover:scale-105 transition-transform" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="text-xs font-bold text-forest-dark truncate group-hover:text-forest">
                              {language === 'bn' ? persona.nameBn : persona.name}
                            </h3>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-forest-light text-forest shrink-0">
                              {persona.district}
                            </span>
                          </div>
                          <p className="text-[11px] text-clay font-semibold mt-0.5">
                            {persona.roleBn}
                          </p>
                          <p className="text-[10px] text-mutedText mt-1 line-clamp-2">
                            {persona.descriptionBn}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions: Registration & Guest Explore */}
            <div className="pt-6 mt-6 border-t border-softBorder space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-secondaryText text-center sm:text-left">
                  <span>{language === 'bn' ? 'নতুন ব্যবহারকারী?' : "Don't have an account?"} </span>
                  <button
                    type="button"
                    onClick={onOpenRegister}
                    className="font-bold text-forest hover:text-forest-dark underline cursor-pointer"
                  >
                    {language === 'bn' ? 'বিনামূল্যে অ্যাকাউন্ট নিবন্ধন করুন' : 'Register New Farm Account'}
                  </button>
                </div>

                {onExploreAsGuest && (
                  <button
                    type="button"
                    onClick={onExploreAsGuest}
                    className="text-xs font-bold text-secondaryText hover:text-primaryText px-3 py-1.5 rounded-xl border border-softBorder bg-rice hover:bg-white transition"
                  >
                    {language === 'bn' ? 'অতিথি হিসেবে দেখুন →' : 'Explore as Guest →'}
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-6xl mx-auto w-full pt-4 border-t border-softBorder/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-mutedText">
        <p>
          © 2026 AgroNex Bangladesh. {language === 'bn' ? 'সকল অধিকার সংরক্ষিত।' : 'All rights reserved.'}
        </p>
        <div className="flex items-center space-x-4">
          <span className="hover:text-primaryText cursor-pointer">{language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</span>
          <span>•</span>
          <span className="hover:text-primaryText cursor-pointer">{language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}</span>
          <span>•</span>
          <span className="hover:text-primaryText cursor-pointer">{language === 'bn' ? 'সহায়তা হেল্পলাইন (১৬১২৩)' : 'Helpline (16123)'}</span>
        </div>
      </footer>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-softBorder">
            <div className="flex items-center justify-between border-b border-softBorder pb-3">
              <h3 className="font-bold text-forest-dark text-sm">
                {language === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Reset Password'}
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-mutedText hover:text-primaryText text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-secondaryText leading-relaxed">
              {language === 'bn'
                ? 'আপনার নিবন্ধিত মোবাইল নম্বর লিখুন। পাসওয়ার্ড রিসেট করার জন্য একটি এককালীন ওটিপি কোড পাঠানো হবে।'
                : 'Enter your registered phone number to receive a one-time reset code.'}
            </p>
            <div>
              <label className="block text-xs font-bold text-primaryText mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
              </label>
              <input
                type="tel"
                placeholder="01712345678"
                value={forgotPhone}
                onChange={(e) => setForgotPhone(e.target.value)}
                className="input-field text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="btn-secondary text-xs"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  showToast(
                    language === 'bn' ? 'রিসেট নির্দেশিকা পাঠানো হয়েছে' : 'Reset code sent',
                    'success',
                    language === 'bn' ? 'আপনার ফোনে সাময়িক কোড: 123456' : 'Temporary code: 123456'
                  );
                }}
                className="btn-primary text-xs"
              >
                {language === 'bn' ? 'রিসেট ওটিপি পাঠান' : 'Send Reset Code'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

