import { Button } from './Button';
import ArrowNext from '~/assets/icons/arrow_next.svg?react';
import Check from '~/assets/icons/check.svg?react';

type VoteItemProps = {
  status: 'planned' | 'available' | 'participated' | 'closed';
  title: string;
  schedule: string;
  votingRate: number;
  participated?: boolean;
};

export function VoteItem({
  status,
  title,
  schedule,
  votingRate,
  participated,
}: VoteItemProps) {
  return (
    <li className="flex items-center justify-between p-4 border border-gray-300 bg-gray-50 rounded-lg">
      <div>
        <div className="flex items-center gap-2 text-xl font-semibold">
          {title}
          {participated && (
            <span className="flex items-center text-sm font-semibold text-sky-500 fill-sky-500">
              <Check width={20} height={20} />
              참여함
            </span>
          )}
        </div>
        <div className="text-gray-500">{schedule}</div>
        {status !== 'planned' && (
          <div className="text-gray-500 font-semibold">
            {status === 'closed' ? '최종 투표율' : '실시간 투표율'} {votingRate}
            %
          </div>
        )}
      </div>
      <Button
        text="투표하기"
        icon={<ArrowNext className="fill-white" width={20} />}
        iconPosition="right"
        size="medium"
      />
    </li>
  );
}
