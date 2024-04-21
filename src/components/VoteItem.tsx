import { Button } from './Button';
import ArrowNext from '~/assets/icons/arrow_next.svg?react';
import Check from '~/assets/icons/check.svg?react';

type VoteItemProps = {
  status: 'planned' | 'current' | 'closed';
  title: string;
  from: string;
  to: string;
  votingRate: number;
  participated?: boolean;
};

export function VoteItem({
  status,
  title,
  from,
  to,
  votingRate,
  participated,
}: VoteItemProps) {
  return (
    <li className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between p-3 border border-gray-300 bg-gray-50 rounded-xl hover:-translate-y-0.5 transition-transform">
      <div>
        <div className="flex items-center gap-2 text-xl font-semibold">
          {title}
          {status === 'closed' && participated && (
            <span className="text-nowrap flex items-center text-sm font-semibold text-sky-500 fill-sky-500">
              <Check width={20} height={20} />
              참여함
            </span>
          )}
        </div>
        <div className="gap-0 flex flex-col sm:flex-row sm:gap-1 text-gray-500 text-sm sm:text-base">
          <div>{from}</div> <div>~ {to}</div>
        </div>
        {status !== 'planned' && (
          <div className="text-gray-500 font-semibold text-sm sm:text-base">
            {status === 'closed' ? '최종 투표율' : '실시간 투표율'} {votingRate}
            %
          </div>
        )}
      </div>
      {status === 'current' ? (
        <Button
          text={participated ? '투표 완료' : '투표하기'}
          icon={
            participated ? (
              <Check className="fill-white" width={20} height={20} />
            ) : (
              <ArrowNext className="fill-white" width={20} height={20} />
            )
          }
          iconPosition="right"
          size="medium"
          disabled={participated ? true : false}
          fullWidth
          className="w-full sm:w-auto"
        />
      ) : (
        <Button
          text="투표 개요"
          icon={<ArrowNext className="fill-white" width={20} height={20} />}
          iconPosition="right"
          size="medium"
          className="w-full sm:w-auto"
        />
      )}
    </li>
  );
}
