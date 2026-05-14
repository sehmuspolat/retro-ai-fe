'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from '@/types';
import { CardItem } from '../cards/CardItem';

interface ColumnProps {
  id: string;
  title: string;
  cards: Card[];
}

export const Column: React.FC<ColumnProps> = ({ id, title, cards }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col w-full min-w-[320px] max-w-sm bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </h3>
        <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full">
          {cards.length}
        </span>
      </div>

      <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[150px]">
        <SortableContext 
          items={cards.map(c => c.id)} 
          strategy={verticalListSortingStrategy}
        >
          {cards.map(card => (
            <CardItem key={card.id} card={card} />
          ))}
          {cards.length === 0 && (
            <div className="text-center text-sm text-slate-400 dark:text-slate-500 py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
              Buraya kart bırakabilirsiniz
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};
