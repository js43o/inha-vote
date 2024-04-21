import { useNavigate } from 'react-router-dom';
import Undo from '~/assets/icons/undo.svg?react';
import { Button, Menu } from '~/components';
import { Candidate } from './Candidate';

export function VoteDetailPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-24 p-4 items-center">
      <Menu />
      <main className="flex flex-col gap-6 w-full max-w-[768px]">
        <header className="flex justify-between gap-1">
          <h1 className="text-3xl font-bold">투표 상세 정보</h1>
          <Button
            theme="secondary"
            icon={<Undo width={20} />}
            text="이전으로"
            size="medium"
            onClick={() => navigate('/vote/current')}
          />
        </header>
        <div className="text-white bg-sky-500 py-2 px-4 flex justify-between">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold">
              2024학년도 인하대학교 총학생회 선거
            </h2>
            <div className="font-semibold">실시간 투표율 20%</div>
          </div>
          <div className="sm:flex flex-col items-end justify-center hidden">
            <div>투표 종료까지</div>
            <div className="text-3xl font-semibold leading-none">47:59:59</div>
          </div>
        </div>
        <ul className="flex flex-col gap-1">
          <li className="flex">
            <div className="w-20 text-gray-500">투표 기간</div>
            <div className="font-semibold">
              2024년 4월 3일 (수) ~ 2024년 4월 5일 (금)
            </div>
          </li>
          <li className="flex">
            <div className="w-20 text-gray-500 ">투표 시간</div>
            <div>매일 06:00 ~ 18:30</div>
          </li>
          <li className="flex">
            <div className="w-20 text-gray-500 ">후보자 수</div>
            <div>2명</div>
          </li>
          <li className="flex">
            <div className="w-20 text-gray-500 ">개표 일정</div>
            <div>2024년 4월 10일 (월)</div>
          </li>
          <li className="flex">
            <div className="w-20 text-gray-500 ">결과 발표</div>
            <div>2024년 4월 11일 (화) 10:00</div>
          </li>
        </ul>
        <h2 className="text-2xl font-bold">후보자 정보</h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Candidate />
          <Candidate />
        </ul>
        <div className="flex flex-col items-center gap-2 mt-16">
          <div>위 내용을 모두 확인하셨나요?</div>
          <Button text="투표권 발급받기" fullWidth />
        </div>
      </main>
    </div>
  );
}
