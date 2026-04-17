import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { getImageUrl } from '../../lib/utils';

interface GeneratedImagesGridProps {
  images: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export default function GeneratedImagesGrid({
  images,
  selectedIndex,
  onSelect,
}: GeneratedImagesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(index)}
          className={cn(
            'relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200',
            selectedIndex === index
              ? 'border-brand-primary shadow-lg shadow-brand-primary/20'
              : 'border-transparent hover:border-brand-primary/30',
          )}
        >
          <img
            src={getImageUrl(image)}
            alt={`Generated ${index + 1}`}
            className="w-full aspect-square object-cover"
          />
          {selectedIndex === index && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 right-3 h-8 w-8 gradient-brand rounded-full flex items-center justify-center shadow-lg"
            >
              <Check className="h-4 w-4 text-white" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
