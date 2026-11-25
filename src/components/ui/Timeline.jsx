import React from 'react';
import { Check, Clock, AlertCircle, FileCheck, XCircle, UserCheck, CheckCheck } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import { SUBMISSION_STATUS } from '../../utils/constants';

export default function Timeline({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return <p className="text-sm text-slate-500 italic">Belum ada riwayat aktivitas.</p>;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case SUBMISSION_STATUS.COMPLETED:
        return <CheckCheck className="w-4 h-4 text-emerald-600" />;
      case SUBMISSION_STATUS.APPROVED:
        return <Check className="w-4 h-4 text-emerald-600" />;
      case SUBMISSION_STATUS.LECTURER_REVIEW:
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      case SUBMISSION_STATUS.REJECTED:
        return <XCircle className="w-4 h-4 text-red-600" />;
      case SUBMISSION_STATUS.REVISION_REQUIRED:
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case SUBMISSION_STATUS.UNDER_REVIEW:
        return <FileCheck className="w-4 h-4 text-blue-600" />;
      case SUBMISSION_STATUS.PENDING:
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getIconBg = (status) => {
    switch (status) {
      case SUBMISSION_STATUS.COMPLETED:
        return 'bg-emerald-100 border-emerald-200';
      case SUBMISSION_STATUS.APPROVED:
        return 'bg-emerald-100 border-emerald-200';
      case SUBMISSION_STATUS.LECTURER_REVIEW:
        return 'bg-purple-100 border-purple-200';
      case SUBMISSION_STATUS.REJECTED:
        return 'bg-red-100 border-red-200';
      case SUBMISSION_STATUS.REVISION_REQUIRED:
        return 'bg-orange-100 border-orange-200';
      case SUBMISSION_STATUS.UNDER_REVIEW:
        return 'bg-blue-100 border-blue-200';
      case SUBMISSION_STATUS.PENDING:
      default:
        return 'bg-amber-100 border-amber-200';
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {activities.map((item, index) => {
        const isLatest = index === activities.length - 1;
        return (
          <div key={item.id || index} className="relative flex items-start group">
            {/* Dot / Icon */}
            <div
              className={`absolute -left-6 mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center bg-white shadow-sm transition-transform ${getIconBg(
                item.status
              )} ${isLatest ? 'ring-4 ring-blue-50' : ''}`}
            >
              {getStatusIcon(item.status)}
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-xs ml-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                <h4 className="text-sm font-semibold text-[#172033]">{item.title}</h4>
                <span className="text-xs text-slate-400 font-normal">
                  {formatDateTime(item.createdAt)}
                </span>
              </div>

              {item.description && (
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {item.description}
                </p>
              )}

              {item.actorName && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>Dilakukan oleh:</span>
                  <span className="font-medium text-slate-600">{item.actorName}</span>
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                    {item.actorRole}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
