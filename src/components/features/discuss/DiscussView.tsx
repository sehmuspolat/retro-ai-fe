'use client';

import React from 'react';
import { useCardStore } from '@/store/useCardStore';
import { useRetroStore } from '@/store/useRetroStore';
import { GroupDiscussion } from './GroupDiscussion';
import { MessageSquare, ArrowRight } from 'lucide-react';

export const DiscussView: React.FC = () => {
  const { cards, groups, persons } = useCardStore();
  const { currentPersonId, nextStep } = useRetroStore();

  const aiGroups = groups.filter(g => g.category === 'ai-group');
  const categoryGroups = groups.filter(g => ['went-well', 'went-wrong', 'improve', 'puzzles'].includes(g.category));

  const sourceGroups = aiGroups.length > 0 ? aiGroups : categoryGroups;

  const sortedGroups = sourceGroups
    .map(group => {
      const groupCards = cards.filter(c => c.groupId === group.id);
      const totalVotes = groupCards.reduce((sum, c) => sum + c.votes, 0);
      return { ...group, cards: groupCards.sort((a, b) => b.votes - a.votes), totalVotes };
    })
    .sort((a, b) => b.totalVotes - a.totalVotes);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-turkcell-navy rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <MessageSquare size={18} className="text-turkcell-blue" />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            En çok oylanan konular sırayla görüntülenmektedir. Her konu için ses kaydı yapın, transkript alın ve AI çözüm önerisi isteyin.
          </p>
        </div>
        <button
          onClick={nextStep}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg bg-turkcell-navy text-turkcell-yellow hover:bg-turkcell-navy-light transition-colors flex-shrink-0"
        >
          İncelemeye Geç <ArrowRight size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {sortedGroups.map((group, index) => (
          <GroupDiscussion
            key={group.id}
            group={group}
            cards={group.cards}
            persons={persons}
            rank={index + 1}
            currentPersonId={currentPersonId}
          />
        ))}
      </div>
    </div>
  );
};
