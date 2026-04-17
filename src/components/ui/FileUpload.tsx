import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  preview?: string | null;
  className?: string;
}

export default function FileUpload({
  onFileSelect,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
  maxSize = 10 * 1024 * 1024,
  preview: externalPreview,
  className,
}: FileUploadProps) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(externalPreview || null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileSelect(file);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const clearPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer',
        'flex flex-col items-center justify-center min-h-[200px]',
        isDragActive
          ? 'border-brand-primary bg-brand-primary/5'
          : 'border-slate-200 hover:border-brand-primary/50 hover:bg-slate-50',
        className,
      )}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="relative w-full h-full min-h-[200px] flex items-center justify-center p-4">
          <img
            src={preview}
            alt="Preview"
            className="max-h-[300px] max-w-full object-contain rounded-xl"
          />
          <button
            onClick={clearPreview}
            className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
          >
            <X className="h-4 w-4 text-red-500" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 p-8">
          <div className="p-3 rounded-xl bg-brand-primary/10">
            {isDragActive ? (
              <ImageIcon className="h-8 w-8 text-brand-primary" />
            ) : (
              <Upload className="h-8 w-8 text-brand-primary" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">
              {isDragActive ? 'Drop your file here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
