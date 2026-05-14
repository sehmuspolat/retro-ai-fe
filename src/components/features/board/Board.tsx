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

  const ungroupedCards = cards.filter(c => !c.groupId);
  
  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
        <div className="snap-start">
          <Column id="ungrouped" title="Fikirler (Gruplanmamış)" cards={ungroupedCards} />
        </div>

        {groups.map(group => (
          <div key={group.id} className="snap-start">
            <Column 
              id={group.id} 
              title={group.title} 
              cards={cards.filter(c => c.groupId === group.id)} 
            />
          </div>
        ))}
      </div>
    </DndContext>
  );
};
