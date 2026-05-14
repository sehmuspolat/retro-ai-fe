'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card } from '@/types';
import { useAiStore } from '@/store/useAiStore';
import { AudioPlayer } from '../media/AudioPlayer';

interface CardItemProps {
  card: Card;
}

export const CardItem: React.FC<CardItemProps> = ({ card }) => {
  const { analyzeCardAndSuggest, isAnalyzingCardId } = useAiStore();
  const isAnalyzing = isAnalyzingCardId === card.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAnalyzeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    analyzeCardAndSuggest(card);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative flex flex-col gap-3 p-4 rounded-xl cursor-grab active:cursor-grabbing
        bg-white dark:bg-slate-900 border transition-shadow
        ${isDragging ? 'shadow-2xl border-blue-500' : 'shadow-sm border-slate-200 dark:border-slate-800 hover:shadow-md'}
      `}
    >
      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
        {card.content}
      </p>

      {card.audioUrl && (
        <div className="mt-1" onPointerDown={(e) => e.stopPropagation()}>
          <AudioPlayer audioUrl={card.audioUrl} />
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
            {card.authorId === 'p1' ? 'A' : (card.authorId === 'p2' ? 'Ay' : 'M')}
          </div>
        </div>

        <button
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing}
          onPointerDown={(e) => e.stopPropagation()}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
            ${isAnalyzing 
              ? 'bg-purple-100 text-purple-400 cursor-not-allowed' 
              : 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40'
            }
          `}
        >
          <Sparkles size={14} className={isAnalyzing ? 'animate-pulse' : ''} />
          {isAnalyzing ? 'Analiz Ediliyor...' : 'AI Çözüm Üret'}
        </button>
      </div>
    </motion.div>
  );
};
