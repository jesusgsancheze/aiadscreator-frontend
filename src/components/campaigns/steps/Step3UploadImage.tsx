import { useTranslation } from 'react-i18next';
import FileUpload from '../../ui/FileUpload';

interface Step3Props {
  preview: string | null;
  onFileSelect: (file: File, preview: string) => void;
}

export default function Step3UploadImage({ preview, onFileSelect }: Step3Props) {
  const { t } = useTranslation();

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      onFileSelect(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{t('campaigns.step3Title')}</h2>
        <p className="text-sm text-slate-500 mt-2">{t('campaigns.step3Desc')}</p>
      </div>

      <div className="max-w-lg mx-auto">
        <FileUpload onFileSelect={handleFile} preview={preview} className="min-h-[300px]" />
      </div>
    </div>
  );
}
