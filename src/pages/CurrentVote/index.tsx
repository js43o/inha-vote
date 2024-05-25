import { useEffect, useState } from 'react';
import Sort from '~/assets/icons/sort.svg?react';
import { SortBy, Vote } from '~/libs/types';
import { getMockVoteList } from '~/libs/mockApi';
import { VoteItem, Menu, ToggleInput, SortType } from '~/components';

export function CurrentVotePage() {
  const [sortBy, setSortBy] = useState<SortBy>('title');
  const [showOnlyParticiable, setShowOnlyParticiable] = useState(false);
  const [votes, setVotes] = useState<Vote[]>([]);

  const [participatedVotes, setParticipatedVotes] = useState<number[]>([5]); // 온체인 투표 여부

  const onChangeSortBy = (newSortBy: SortBy) => setSortBy(newSortBy);

  const toggleShowOnlyParticiable = () =>
    setShowOnlyParticiable(!showOnlyParticiable);

  useEffect(() => {
    getMockVoteList().then((votes) =>
      setVotes(
        votes.filter((vote) => vote.from < new Date() && vote.to > new Date()),
      ),
    );
  }, []);

  useEffect(() => {
    switch (sortBy) {
      case 'title':
        setVotes((votes) =>
          [...votes].sort((a, b) => a.title.localeCompare(b.title)),
        );
        break;
      case 'endDate':
        setVotes((votes) =>
          [...votes].sort((a, b) => a.to.getTime() - b.to.getTime()),
        );
        break;
      case 'votingRate':
        setVotes((votes) =>
          [...votes].sort((a, b) => b.votingRate - a.votingRate),
        );
        break;
    }
  }, [sortBy]);

  return (
    <div className="flex flex-col gap-24 p-4 items-center">
      <Menu />
      <main className="flex flex-col gap-6 w-full max-w-[768px]">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">진행 중인 투표</h1>
          <div>현재 진행되고 있는 투표 목록입니다.</div>
        </header>
        <div className="flex sm:flex-row flex-col gap-2 items-end sm:items-center justify-between">
          <ToggleInput
            checked={showOnlyParticiable}
            text="참여 가능한 투표만 보기"
            onToggle={toggleShowOnlyParticiable}
          />
          <div className="flex items-center gap-2">
            <span className="flex items-center">
              <Sort width={18} height={18} className="fill-black" />
              정렬
            </span>
            <SortType selected={sortBy} onChangeSortBy={onChangeSortBy} />
          </div>
        </div>
        <ul className="flex flex-col gap-4">
          {votes
            .filter(
              (vote) =>
                !showOnlyParticiable || !participatedVotes.includes(vote.id),
            )
            .map((vote) => (
              <VoteItem
                key={vote.id}
                vote={vote}
                participated={participatedVotes.includes(vote.id)}
              />
            ))}
        </ul>
      </main>
    </div>
  );
}
