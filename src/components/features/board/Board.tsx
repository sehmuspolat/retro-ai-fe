'use client';

import React from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useCardStore } from '@/store/useCardStore';
import { Column } from './Column';

const COLUMN_STYLES: Record<string, { accent: string; bg: string; border: string; icon: string; badgeBg: string; badgeText: string }> = {
  'went-well': {
    accent: 'border-t-emerald-500',
    bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    border: 'border-emerald-200/60 dark:border-emerald-800/40',
    icon: '\u2705',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
  },
  'went-wrong': {
    accent: 'border-t-red-500',
    bg: 'bg-red-50/50 dark:bg-red-950/20',
    border: 'border-red-200/60 dark:border-red-800/40',
    icon: '\u26A0\uFE0F',
    badgeBg: 'bg-red-100 dark:bg-red-900/40',
    badgeText: 'text-red-700 dark:text-red-300',
  },
  'improve': {
    accent: 'border-t-amber-400',
    bg: 'bg-amber-50/50 dark:bg-amber-950/20',
    border: 'border-amber-200/60 dark:border-amber-800/40',
    icon: '\uD83D\uDCA1',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
  },
  'default': {
    accent: 'border-t-sky-500',
    bg: 'bg-sky-50/50 dark:bg-sky-950/20',
    border: 'border-sky-200/60 dark:border-sky-800/40',
    icon: '\uD83D\uDCCC',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/40',
    badgeText: 'text-sky-700 dark:text-sky-300',
  },
};

export const Board: React.FC = () => {
  const { cards, groups, updateCardsGroup } = useCardStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id as string;
    const overId = over.id as string;

    const isOverAColumn = groups.some(g => g.id === overId) || overId === 'ungrouped';
    
    if (isOverAColumn) {
      const targetGroupId = overId === 'ungrouped' ? null : overId;
      updateCardsGroup({ [cardId]: targetGroupId as string });
    }
  };

  const getStyle = (category: string) => COLUMN_STYLES[category] || COLUMN_STYLES['default'];

  const mainGroups = groups.filter(g => ['went-well', 'went-wrong', 'improve'].includes(g.category));
  const extraGroups = groups.filter(g => !['went-well', 'went-wrong', 'improve'].includes(g.category));
  const ungroupedCards = cards.filter(c => !c.groupId);
  
  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {mainGroups.map(group => {
          const style = getStyle(group.category);
          return (
            <Column 
              key={group.id}
              id={group.id} 
              title={group.title} 
              cards={cards.filter(c => c.groupId === group.id)} 
              colorStyle={style}
            />
          );
        })}
      </div>

      {(extraGroups.length > 0 || ungroupedCards.length > 0) && (
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {ungroupedCards.length > 0 && (
            <div className="snap-start min-w-[320px]">
              <Column 
                id="ungrouped" 
                title="Gruplanmamış Fikirler" 
                cards={ungroupedCards} 
                colorStyle={COLUMN_STYLES['default']}
              />
            </div>
          )}
          {extraGroups.map(group => {
            const style = getStyle(group.category);
            return (
              <div key={group.id} className="snap-start min-w-[320px]">
                <Column 
                  id={group.id} 
                  title={group.title} 
                  cards={cards.filter(c => c.groupId === group.id)} 
                  colorStyle={style}
                />
              </div>
            );
          })}
        </div>
      )}
    </DndContext>
  );
};
