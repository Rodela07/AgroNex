import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-softBorder rounded-2xl my-4">
      <div className="p-4 bg-rice rounded-full text-forest mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-forest-dark">{title}</h4>
      <p className="text-sm text-secondaryText max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-forest hover:bg-forest-dark transition shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
