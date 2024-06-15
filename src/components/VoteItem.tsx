import { NavLink } from 'react-router-dom';
import { Button } from './Button';
import ArrowNext from '~/assets/icons/arrow_next.svg?react';
import Check from '~/assets/icons/check.svg?react';
import { Vote } from '~/libs/types';
import { getFormattedDateString } from '~/libs/utils';

type VoteItemProps = {
  vote: Vote;
  participated?: boolean;
  voteRate?: number;
};

export function VoteItem({
  vote: { id, title, from, to },
  participated,
  voteRate = 0,
}: VoteItemProps) {
  const currentDate = new Date();
  const status =
    from < currentDate && to > currentDate
      ? 'current'
      : from > currentDate
        ? 'planned'
        : 'closed';

  return (
    <li
      className={`flex flex-col gap-2 sm:gap-4 sm:flex-row items-start sm:items-center justify-between p-3 border rounded-xl hover:translate-x-1 hover:brightness-105 transition-transform ${status === 'current' ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
    >
      <div className="flex grow flex-col min-w-0 max-w-full">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <div className="text-nowrap whitespace-nowrap overflow-hidden text-ellipsis shrink">
            {title}
          </div>
          {participated && (
            <span className="text-nowrap flex items-center text-sm font-semibold text-blue-600 fill-blue-600">
              <Check width={20} height={20} />
              참여함
            </span>
          )}
        </div>
        <div className="gap-0 flex flex-col sm:flex-row sm:gap-1 text-gray-500 text-sm sm:text-base">
          <p className="flex gap-2">
            <span className="sm:hidden font-semibold">투표 시작</span>
            {getFormattedDateString(from, 'DATE_TIME_KOR')}
          </p>
          <p className="flex gap-2 sm:gap-1">
            <span className="sm:hidden font-semibold">투표 종료</span>
            <span className="hidden sm:block font-semibold">~</span>
            {getFormattedDateString(to, 'DATE_TIME_KOR')}
          </p>
        </div>
        {status !== 'planned' && (
          <div
            className={`${status === 'closed' ? 'text-gray-500' : 'text-blue-500'} font-bold text-sm sm:text-base`}
          >
            {status === 'closed' ? '최종 투표율' : '실시간 투표율'} {voteRate}%
          </div>
        )}
      </div>
      <NavLink to={`/vote/${id}`} className={`w-full sm:w-auto`}>
        <Button
          text="투표 개요"
          icon={<ArrowNext className="fill-white" width={20} height={20} />}
          iconPosition="right"
          size="medium"
          fullWidth
        />
      </NavLink>
    </li>
  );
}
