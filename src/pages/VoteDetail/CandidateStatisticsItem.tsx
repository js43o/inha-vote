import { useState } from 'react';
import { Candidate, CandidateStatistics } from '~/libs/types';
import { StatisticsChart } from './StatisticsChart';
import { Divider } from '~/components';

type CandidateStatisticsItemProps = Pick<
  Candidate,
  'affiliation' | 'name' | 'imgSrc'
> & { allTotalNumberOfVotes: number; statistics: CandidateStatistics };

export function CandidateStatisticsItem({
  affiliation,
  name,
  imgSrc,
  allTotalNumberOfVotes,
  statistics: { totalNumberOfVotes, numberOfVotesBy },
}: CandidateStatisticsItemProps) {
  const [showDetail, setShowDetail] = useState(false);

  const toggleShowDetail = () => setShowDetail(!showDetail);

  return (
    <li
      className={`flex flex-col gap-2 hover:bg-white bg-gray-50 active:bg-gray-100 cursor-pointer border border-gray-300 overflow-hidden rounded-lg ${showDetail ? '' : ''}`}
      onClick={toggleShowDetail}
    >
      <div className="flex gap-2 p-2">
        <img src={imgSrc} width={64} height={64} className="rounded-lg" />
        <div className="flex flex-col justify-center">
          <p className="text-sm">{affiliation}</p>
          <p className="font-semibold">{name}</p>
        </div>
        <div className="flex flex-col grow justify-center items-end text-lg leading-tight">
          <p className="font-semibold">
            {((totalNumberOfVotes / allTotalNumberOfVotes) * 100).toFixed(2)}%
          </p>
          <p className="text-sm">{totalNumberOfVotes}표</p>
        </div>
      </div>
      {showDetail && (
        <>
          <Divider />
          <div className="flex flex-col gap-2 pt-0 p-4">
            <StatisticsChart
              totalNumberOfVotes={allTotalNumberOfVotes}
              data={numberOfVotesBy}
              slim
            />
          </div>
        </>
      )}
    </li>
  );
}
