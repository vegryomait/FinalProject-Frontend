import React from 'react';
import { STATUS_CONFIG, SUBMISSION_STATUS } from '../../utils/constants';

export default function StatusBadge({ status, className = '', size = 'md' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[SUBMISSION_STATUS.PENDING];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.badgeClass} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </span>
  );
}
