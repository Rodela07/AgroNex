import React from 'react';
import { useApp } from '../../context/AppContext';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { language } = useApp();

  let colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';
  let label = status;

  switch (status.toLowerCase()) {
    case 'published':
    case 'completed':
    case 'optimal':
    case 'healthy':
    case 'verified':
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      label = language === 'bn' ? 'সক্রিয় / সমাপ্ত' : 'Active / Completed';
      if (status === 'published') label = language === 'bn' ? 'বিজ্ঞাপিত' : 'Published';
      if (status === 'completed') label = language === 'bn' ? 'সম্পন্ন' : 'Completed';
      if (status === 'optimal') label = language === 'bn' ? 'অনুকূল' : 'Optimal';
      if (status === 'healthy') label = language === 'bn' ? 'সুস্থ' : 'Healthy';
      break;

    case 'accepted':
    case 'ready_for_pickup':
    case 'upcoming':
      colorClasses = 'bg-blue-50 text-river-dark border-blue-200';
      label = language === 'bn' ? 'গৃহীত / প্রস্তুত' : 'Accepted / Ready';
      if (status === 'accepted') label = language === 'bn' ? 'গৃহীত' : 'Accepted';
      if (status === 'ready_for_pickup') label = language === 'bn' ? 'পিকআপের জন্য প্রস্তুত' : 'Ready for Pickup';
      if (status === 'upcoming') label = language === 'bn' ? 'আসন্ন' : 'Upcoming';
      break;

    case 'pending':
    case 'countered':
    case 'treatment':
    case 'warning':
    case 'draft':
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
      label = language === 'bn' ? 'বিবেচনাধীন / সতর্কতা' : 'Pending / Warning';
      if (status === 'pending') label = language === 'bn' ? 'অপেক্ষমাণ' : 'Pending';
      if (status === 'countered') label = language === 'bn' ? 'কাউন্টার অফার' : 'Countered';
      if (status === 'treatment') label = language === 'bn' ? 'চিকিৎসাধীন' : 'Under Treatment';
      if (status === 'warning') label = language === 'bn' ? 'সতর্কতা' : 'Warning';
      if (status === 'draft') label = language === 'bn' ? 'খসড়া' : 'Draft';
      break;

    case 'cancelled':
    case 'rejected':
    case 'overdue':
    case 'critical':
    case 'quarantine':
      colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
      label = language === 'bn' ? 'বাতিল / জরুরি' : 'Cancelled / Critical';
      if (status === 'cancelled') label = language === 'bn' ? 'বাতিল' : 'Cancelled';
      if (status === 'rejected') label = language === 'bn' ? 'প্রত্যাখ্যাত' : 'Rejected';
      if (status === 'overdue') label = language === 'bn' ? 'বকেয়া / অতিক্রম' : 'Overdue';
      if (status === 'critical') label = language === 'bn' ? 'সংকটজনক' : 'Critical';
      break;

    case 'sold':
    case 'paused':
      colorClasses = 'bg-gray-100 text-gray-700 border-gray-300';
      label = language === 'bn' ? (status === 'sold' ? 'বিক্রিত' : 'স্থগিত') : status;
      break;
    default:
      label = status;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${colorClasses} ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {label}
    </span>
  );
};
