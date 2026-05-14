'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from '@/types';
import { CardItem } from '../cards/CardItem';

interface ColumnColorStyle {
  accent: string;
  bg: string;
  border: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
}

interface ColumnProps {
  id: string;
  title: string;
  cards: Card[];
  colorStyle: ColumnColorStyle;
}

export const Column: React.FC<ColumnProps> = ({ id, title, cards, colorStyle }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className={`flex flex-col w-full rounded-2xl p-4 border-t-4 border ${colorStyle.accent} ${colorStyle.bg} ${colorStyle.border} shadow-sm`}>
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{colorStyle.icon}</span>
          <h3 className="font-bold text-sm uppercase tracking-wide text-turkcell-navy dark:text-slate-200">
            {title}
          </h3>
        </div>
        <span className={`${colorStyle.badgeBg} ${colorStyle.badgeText} text-xs font-bold px-2.5 py-1 rounded-full`}>
          {cards.length}
        </span>
      </div>

      <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[120px]">
        <SortableContext 
          items={cards.map(c => c.id)} 
          strategy={verticalListSortingStrategy}
        >
          {cards.map(card => (
            <CardItem key={card.id} card={card} />
          ))}
          {cards.length === 0 && (
            <div className="text-center text-sm text-slate-400 dark:text-slate-500 py-10 border-2 border-dashed border-slate-300/50 dark:border-slate-700/50 rounded-xl">
              Buraya kart bırakabilirsiniz
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};
