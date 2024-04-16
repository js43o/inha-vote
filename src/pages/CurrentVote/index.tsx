import Sort from '~/assets/icons/sort.svg?react';
import { Menu } from '~/components';
import { VoteItem } from '~/components';

export function CurrentVotePage() {
  return (
    <div className="flex flex-col gap-24 py-4 items-center">
      <Menu />
      <main className="flex flex-col gap-6 w-[768px]">
        <header className="flex flex-col gap-1">
          <h1>진행 중인 투표</h1>
          <div>현재 진행되고 있는 투표 목록입니다.</div>
        </header>
        <div className="flex items-center justify-between">
          <div>아직 참여하지 않은 투표만 보기</div>
          <div>
            <span>
              <Sort />
              정렬
            </span>
            <div>
              <div>제목순</div>
              <div>종료일순</div>
              <div>등록일순</div>
            </div>
          </div>
        </div>
        <ul className="flex flex-col gap-4">
          <VoteItem
            status="available"
            title="2024학년도 총학생회 선거"
            schedule="2024년 4월 3일(수) 06:00 ~ 2024년 4월 5일(금) 18:30"
            votingRate={70}
            participated
          />
        </ul>
      </main>
    </div>
  );
}
