import { useEffect, useState } from 'react';
import { getMockVoteStatistics } from '~/libs/mockApi';
import { Candidate, VoteStatistics } from '~/libs/types';
import { CandidateStatisticsItem } from './CandidateStatisticsItem';
import { StatisticsChart } from './StatisticsChart';

type StatisticsSectionProps = {
  voteId: number;
  candidates: Candidate[];
};

export function StatisticsSection({
  voteId,
  candidates,
}: StatisticsSectionProps) {
  const [voteStatistics, setVoteStatistics] = useState<VoteStatistics | null>(
    null,
  );
  const allTotalNumberOfVotes =
    voteStatistics?.candidates.reduce(
      (acc, cur) => acc + cur.totalNumberOfVotes,
      0,
    ) || 0;

  useEffect(() => {
    if (voteId) {
      getMockVoteStatistics().then(setVoteStatistics);
    }
  }, [voteId]);

  if (!voteStatistics) return <>통계 불러오는 중...</>;

  return (
    <section className="flex flex-col w-full gap-4 px-4 md:px-8">
      <h2 className="flex justify-between">
        <span className="text-2xl font-bold">투표 통계</span>
        <span className="text-lg text-gray-500">
          총 <span className="font-bold">{allTotalNumberOfVotes}표</span> 중
        </span>
      </h2>
      {voteStatistics ? (
        <StatisticsChart
          totalNumberOfVotes={allTotalNumberOfVotes}
          data={{
            gender: {
              man: voteStatistics.candidates.reduce(
                (acc, cur) => acc + cur.numberOfVotesBy.gender.man,
                0,
              ),
              woman: voteStatistics.candidates.reduce(
                (acc, cur) => acc + cur.numberOfVotesBy.gender.woman,
                0,
              ),
            },
            college: {
              business: voteStatistics.candidates.reduce(
                (acc, cur) => acc + cur.numberOfVotesBy.college.business,
                0,
              ),
              humanities: voteStatistics.candidates.reduce(
                (acc, cur) => acc + cur.numberOfVotesBy.college.humanities,
                0,
              ),
              natural: voteStatistics.candidates.reduce(
                (acc, cur) => acc + cur.numberOfVotesBy.college.natural,
                0,
              ),
              engineering: voteStatistics.candidates.reduce(
                (acc, cur) => acc + cur.numberOfVotesBy.college.engineering,
                0,
              ),
            },
          }}
        />
      ) : null}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">후보자별 득표수</h3>
        <ul className="flex flex-col gap-3">
          {voteStatistics.candidates.map((statistics) => {
            const candidate = candidates.find(
              (candidate) => candidate.id === statistics.id,
            );
            return candidate ? (
              <CandidateStatisticsItem
                key={candidate.id}
                name={candidate.name}
                affiliation={candidate.affiliation}
                imgSrc={candidate.imgSrc}
                allTotalNumberOfVotes={allTotalNumberOfVotes}
                statistics={statistics}
              />
            ) : null;
          })}
        </ul>
      </div>
    </section>
  );
}
