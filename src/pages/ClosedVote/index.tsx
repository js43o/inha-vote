import { useEffect, useState } from 'react';
import Sort from '~/assets/icons/sort.svg?react';
import { Menu } from '~/components';
import { VoteItem } from '~/components';
import { ToggleInput } from '~/components';
import { SortType } from '~/components/SortType';
import { getMockVoteList } from '~/lib/mockApi';
import { SortBy, Vote } from '~/lib/types';

export function ClosedVotePage() {
  const [sortBy, setSortBy] = useState<SortBy>('title');
  const [showOnlyVoted, setShowOnlyVoted] = useState(false);
  const [votes, setVotes] = useState<Vote[]>([]);

  const onChangeSortBy = (newSortBy: SortBy) => setSortBy(newSortBy);

  const toggleShowOnlyVoted = () => setShowOnlyVoted(!showOnlyVoted);

  useEffect(() => {
    getMockVoteList().then((votes) =>
      setVotes(votes.filter((vote) => vote.to < new Date())),
    );
  }, []);

  useEffect(() => {
    switch (sortBy) {
      case 'title':
        setVotes([...votes].sort((a, b) => a.title.localeCompare(b.title)));
        break;
      case 'endDate':
        setVotes([...votes].sort((a, b) => a.to.getTime() - b.to.getTime()));
        break;
      case 'votingRate':
        setVotes([...votes].sort((a, b) => b.votingRate - a.votingRate));
        break;
    }
  }, [sortBy]);

  return (
    <div className="flex flex-col gap-24 p-4 items-center">
      <Menu />
      <main className="flex flex-col gap-6 w-full max-w-[768px]">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">종료된 투표</h1>
          <div>종료된 지난 투표 목록입니다.</div>
        </header>
        <div className="flex sm:flex-row flex-col gap-2 items-end sm:items-center justify-between">
          <ToggleInput
            checked={showOnlyVoted}
            text="내가 참여한 투표만 보기"
            onToggle={toggleShowOnlyVoted}
          />
          <div className="flex items-center gap-2">
            <span className="flex items-center font-semibold">
              <Sort width={20} height={20} />
              정렬
            </span>
            <SortType selected={sortBy} onChangeSortBy={onChangeSortBy} />
          </div>
        </div>
        <ul className="flex flex-col gap-4">
          {votes.map((vote) => (
            <VoteItem
              key={vote.id}
              title={vote.title}
              from={vote.from}
              to={vote.to}
              votingRate={vote.votingRate.toFixed(2)}
              participated
            />
          ))}
        </ul>
      </main>
    </div>
  );
}
