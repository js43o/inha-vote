import { useEffect, useState } from 'react';
import { ONE_DAY_MS } from '~/libs/constants';
import { Vote } from '~/libs/types';
import { getFormattedDateString, getVoteStatus } from '~/libs/utils';

type RemainingTimeProps = {
  vote: Vote;
};

export function RemainingTime({ vote }: RemainingTimeProps) {
  const [remainingTime, setRemainingTime] = useState<string>('');

  useEffect(() => {
    const updateRemainingTime = (vote: Vote) =>
      setRemainingTime(
        getFormattedDateString(
          new Date(vote.to.getTime() - Date.now()),
          'TIME_COLON',
        ),
      );

    if (vote && getVoteStatus(vote) === 'current' && !remainingTime) {
      updateRemainingTime(vote);
      window.setInterval(() => updateRemainingTime(vote), 1000);
    }
  }, [vote, remainingTime]);

  return (
    <div className="sm:flex flex-col items-end justify-center hidden">
      {getVoteStatus(vote) === 'current' ? (
        Number(remainingTime.split(':')[0]) < 100 ? (
          <>
            <div>투표 종료까지</div>
            <div className="text-3xl font-bold leading-none">
              {remainingTime}
            </div>
          </>
        ) : (
          <>
            <div>투표 종료까지</div>
            <div className="text-3xl font-bold leading-none">
              D-
              {Math.ceil(
                new Date(vote.to.getTime() - Date.now()).getTime() / ONE_DAY_MS,
              )}
            </div>
          </>
        )
      ) : getVoteStatus(vote) === 'planned' ? (
        <>
          <div>투표 개시까지</div>
          <div className="text-3xl font-bold leading-none">
            D-
            {Math.ceil(
              new Date(vote.from.getTime() - Date.now()).getTime() / ONE_DAY_MS,
            )}
          </div>
        </>
      ) : (
        <div>종료됨</div>
      )}
    </div>
  );
}
