import { Language } from '../types';

export const toBengaliDigits = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
};

export const formatNumber = (num: number, lang: Language): string => {
  if (lang === 'bn') {
    return toBengaliDigits(num.toLocaleString('en-US'));
  }
  return num.toLocaleString('en-US');
};

export const formatCurrency = (amount: number, lang: Language): string => {
  const formatted = formatNumber(amount, lang);
  return lang === 'bn' ? `৳ ${formatted}` : `BDT ${formatted}`;
};

export const formatDate = (dateStr: string, lang: Language): string => {
  if (!dateStr) return '';
  if (lang === 'bn') {
    return toBengaliDigits(dateStr);
  }
  return dateStr;
};
