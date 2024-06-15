import { NumberOfVotesBy } from '~/libs/types';
import { ChartBar } from './ChartBar';

type StatisticsChartProps = {
  totalNumberOfVotes: number;
  data: NumberOfVotesBy;
  slim?: boolean;
};

export function StatisticsChart({
  data: { college, gender },
  slim = false,
}: StatisticsChartProps) {
  return (
    <div className="flex flex-col gap-4 opacity-50">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">성별별 투표수</h3>
        <ChartBar title="남성" value={gender.man} total={100} slim={slim} />
        <ChartBar title="여성" value={gender.woman} total={100} slim={slim} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">단과대별 투표수</h3>
        <ChartBar
          title="경영대학"
          value={college.business}
          total={100}
          slim={slim}
        />
        <ChartBar
          title="인문대학"
          value={college.humanities}
          total={100}
          slim={slim}
        />
        <ChartBar
          title="자연대학"
          value={college.natural}
          total={100}
          slim={slim}
        />
        <ChartBar
          title="공과대학"
          value={college.engineering}
          total={100}
          slim={slim}
        />
      </div>
    </div>
  );
}
