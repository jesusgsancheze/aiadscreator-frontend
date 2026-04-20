import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { Upload, X, ImagePlus } from 'lucide-react';

interface Step3Props {
  previews: string[];
  onAddFiles: (files: File[], previews: string[]) => void;
  onRemove: (index: number) => void;
}

export default function Step3UploadImage({ previews, onAddFiles, onRemove }: Step3Props) {
  const { t } = useTranslation();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remaining = 10 - previews.length;
      const filesToAdd = acceptedFiles.slice(0, remaining);
      if (filesToAdd.length === 0) return;

      const readPromises = filesToAdd.map(
        (file) =>
          new Promise<{ file: File; preview: string }>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({ file, preview: reader.result as string });
            };
            reader.readAsDataURL(file);
          }),
      );

      Promise.all(readPromises).then((results) => {
        onAddFiles(
          results.map((r) => r.file),
          results.map((r) => r.preview),
        );
      });
    },
    [previews.length, onAddFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true,
    disabled: previews.length >= 10,
  });

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{t('campaigns.step3Title')}</h2>
        <p className="text-sm text-slate-500 mt-2">{t('campaigns.step3Desc')}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Image count */}
        <p className="text-sm font-medium text-slate-600 mb-3">
          {t('campaigns.referenceImagesCount', { count: previews.length })}
        </p>

        {/* Image grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
              >
                <img
                  src={src}
                  alt={`Reference ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  title={t('campaigns.removeImage')}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {/* Add more button inside grid */}
            {previews.length < 10 && (
              <div
                {...getRootProps()}
                className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-brand-primary/5"
              >
                <input {...getInputProps()} />
                <ImagePlus className="h-6 w-6 text-slate-400 mb-1" />
                <span className="text-xs text-slate-400">{t('campaigns.addMoreImages')}</span>
              </div>
            )}
          </div>
        )}

        {/* Main dropzone (only when no images yet) */}
        {previews.length === 0 && (
          <div
            {...getRootProps()}
            className={`min-h-[300px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-brand-primary bg-brand-primary/5'
                : 'border-slate-300 hover:border-brand-primary bg-slate-50 hover:bg-brand-primary/5'
            }`}
          >
            <input {...getInputProps()} />
            <div className="p-4 rounded-2xl bg-brand-primary/10 mb-4">
              <Upload className="h-8 w-8 text-brand-primary" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              {t('campaigns.referenceImages')}
            </p>
            <p className="text-xs text-slate-400 text-center max-w-xs">
              {t('campaigns.referenceImagesDesc')}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {t('campaigns.maxReferenceImages')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
