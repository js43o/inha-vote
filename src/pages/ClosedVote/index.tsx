import { useState } from 'react';
import Sort from '~/assets/icons/sort.svg?react';
import { Menu } from '~/components';
import { VoteItem } from '~/components';
import { ToggleInput } from '~/components';
import { SortType } from '~/components/SortType';
import { SortBy } from '~/lib/types';

export function ClosedVotePage() {
  const [sortBy, setSortBy] = useState<SortBy>('title');

  const onChangeSortBy = (newSortBy: SortBy) => setSortBy(newSortBy);

  return (
    <div className="flex flex-col gap-24 p-4 items-center">
      <Menu />
      <main className="flex flex-col gap-6 w-full max-w-[768px]">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">종료된 투표</h1>
          <div>종료된 지난 투표 목록입니다.</div>
        </header>
        <div className="flex sm:flex-row flex-col gap-2 items-end sm:items-center justify-between">
          <ToggleInput text="내가 참여한 투표만 보기" />
          <div className="flex items-center gap-2">
            <span className="flex items-center font-semibold">
              <Sort width={20} height={20} />
              정렬
            </span>
            <SortType selected={sortBy} onChangeSortBy={onChangeSortBy} />
          </div>
        </div>
        <ul className="flex flex-col gap-4">
          <VoteItem
            status="closed"
            title="2024학년도 총학생회 선거"
            from="2024년 4월 3일(수) 06:00"
            to="2024년 4월 5일(금) 18:30"
            votingRate={70}
            participated
          />
          <VoteItem
            status="closed"
            title="2024학년도 총학생회 선거"
            from="2024년 4월 3일(수) 06:00"
            to="2024년 4월 5일(금) 18:30"
            votingRate={70}
          />
          <VoteItem
            status="closed"
            title="2024학년도 총학생회 선거"
            from="2024년 4월 3일(수) 06:00"
            to="2024년 4월 5일(금) 18:30"
            votingRate={70}
          />
        </ul>
      </main>
    </div>
  );
}
