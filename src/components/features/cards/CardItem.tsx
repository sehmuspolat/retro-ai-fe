'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card } from '@/types';
import { useUiStore } from '@/store/useUiStore';
import { AudioPlayer } from '../media/AudioPlayer';

interface CardItemProps {
  card: Card;
}

export const CardItem: React.FC<CardItemProps> = ({ card }) => {
  const { openActionDrawer } = useUiStore();

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
    openActionDrawer(card);
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
        bg-white dark:bg-turkcell-navy border transition-shadow
        ${isDragging ? 'shadow-2xl border-turkcell-yellow ring-2 ring-turkcell-yellow/30' : 'shadow-sm border-slate-200 dark:border-slate-700 hover:shadow-md'}
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

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-turkcell-yellow/20 text-turkcell-navy flex items-center justify-center text-xs font-bold">
            {card.authorId === 'p1' ? 'AY' : (card.authorId === 'p2' ? 'AK' : card.authorId === 'p3' ? 'MD' : card.authorId === 'p4' ? 'ZÇ' : 'CÖ')}
          </div>
        </div>

        <button
          onClick={handleAnalyzeClick}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-turkcell-navy/5 text-turkcell-navy hover:bg-turkcell-navy/10 dark:bg-turkcell-yellow/10 dark:text-turkcell-yellow dark:hover:bg-turkcell-yellow/20"
        >
          <Sparkles size={14} />
          AI Çözüm Üret
        </button>
      </div>
    </motion.div>
  );
};
