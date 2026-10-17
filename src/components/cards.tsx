import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';

export interface ResourceCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  isVerified: boolean;
  contactInfo?: string;
  onSave?: (id: string) => void;
  saved?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title, category, description, location, isVerified,
  contactInfo, onSave, saved = false
}) => {
  const safeId = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-emerald-500"
      role="article"
      aria-labelledby={`resource-title-${safeId}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
          {category}
        </span>
        {isVerified ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600" aria-label="Recurso verificado">
            ✓ Verificado
          </span>
        ) : (
          <span className="text-xs font-semibold text-amber-600" aria-label="Datos de demostración">Demo</span>
        )}
      </div>

      <h3 id={`resource-title-${safeId}`} className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mb-4 flex-grow text-sm leading-relaxed text-gray-600">{description}</p>

      <div className="mt-auto space-y-3">
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <span>{location}</span>
          <span>Fecha de ejemplo</span>
        </div>

        {contactInfo && (
          <a
            href={contactInfo.startsWith('http') ? contactInfo : `tel:${contactInfo}`}
            className="block w-full rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            aria-label={`Contactar a ${title}`}
          >
            Contactar
          </a>
        )}

        {onSave && (
          <button
            type="button"
            onClick={() => onSave(title)}
            aria-pressed={saved}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            aria-label={saved ? 'Quitar de guardados' : 'Guardar en favoritos'}
          >
            {saved ? (
              <BookmarkCheck size={18} aria-hidden="true" />
            ) : (
              <Bookmark size={18} aria-hidden="true" />
            )}
            {saved ? 'Guardado' : 'Guardar'}
          </button>
        )}
      </div>
    </motion.article>
  );
};
