import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Eye } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

export default function FileUploader({
  files = [],
  onChange,
  maxSizeMB = 5,
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
  label = 'Upload Dokumen Pendukung',
  required = false,
  helperText = 'Format PDF, JPG, PNG (Maksimal 5MB)',
  multiple = false,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateAndAddFiles = (selectedFiles) => {
    setErrorMessage('');
    const newItems = [];
    let filesProcessed = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // Validate size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMessage(`Ukuran file "${file.name}" melebihi batas ${maxSizeMB}MB.`);
        return;
      }

      // Validate type
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        setErrorMessage(
          `Format file "${file.name}" tidak didukung. Harap gunakan PDF, JPG, atau PNG.`
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        newItems.push({
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          fileUrl: event.target.result, // Store Base64 data URL for preview
          uploadDate: new Date().toISOString(),
        });

        filesProcessed++;
        if (filesProcessed === selectedFiles.length) {
          if (multiple) {
            onChange([...files, ...newItems]);
          } else {
            onChange(newItems.slice(0, 1));
          }
        }
      };

      reader.onerror = () => {
        // Fallback if reader fails
        newItems.push({
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          fileUrl: URL.createObjectURL(file),
          uploadDate: new Date().toISOString(),
        });
        filesProcessed++;
        if (filesProcessed === selectedFiles.length) {
          if (multiple) {
            onChange([...files, ...newItems]);
          } else {
            onChange(newItems.slice(0, 1));
          }
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemove = (fileId) => {
    onChange(files.filter((f) => f.id !== fileId));
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#172033] mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          isDragOver
            ? 'border-[#3478E5] bg-blue-50/70'
            : 'border-slate-300 hover:border-[#3478E5] bg-white hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={allowedTypes.join(',')}
          onChange={handleFileChange}
        />

        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-medium text-[#172033] text-center mb-1">
          <span className="text-[#3478E5] underline decoration-blue-300 underline-offset-2">
            Klik untuk mengunggah
          </span>{' '}
          atau seret file ke sini
        </p>
        <p className="text-xs text-slate-500 text-center">{helperText}</p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#172033] truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(file.id);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-slate-200/50 transition-colors"
                  title="Hapus file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
