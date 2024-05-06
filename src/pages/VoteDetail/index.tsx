import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Undo from '~/assets/icons/undo.svg?react';
import Check from '~/assets/icons/check.svg?react';
import { Button, Menu } from '~/components';
import { Candidate, Vote } from '~/libs/types';
import { getMockCandidateList, getMockVote } from '~/libs/mockApi';
import { getFormattedDateString, getVoteStatus } from '~/libs/utils';
import { CandidateItem } from './CandidateItem';
import { BallotIssueModal } from './BallotIssueModal';
import { BallotValidationModal } from './VotingModal';
import { RemainingTime } from './RemainingTime';
import { StatisticsSection } from './StatisticsSection';

export function VoteDetailPage() {
  const navigate = useNavigate();
  const { id: voteId } = useParams();
  const [vote, setVote] = useState<Vote>();
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [issued, setIssued] = useState(true); // 온체인 투표권 발급 여부
  const [participated, setParticipated] = useState(false); // 온체인 투표 여부

  const [showBallotIssueModal, setShowBallotIssueModal] = useState(false);
  const [showBallotValidationModal, setShowBallotValidationModal] =
    useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);

  useEffect(() => {
    if (!voteId) return;
    getMockVote(Number(voteId)).then((vote) => setVote(vote));
    getMockCandidateList().then((candidates) => setCandidates(candidates));
  }, [voteId]);

  if (!voteId || !vote || !candidates) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BallotIssueModal
        vote={vote}
        visible={showBallotIssueModal}
        onClose={() => setShowBallotIssueModal(false)}
      />
      <BallotValidationModal
        visible={showBallotValidationModal}
        onClose={() => setShowBallotValidationModal(false)}
      />
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
              onClick={() =>
                navigate(
                  getVoteStatus(vote) === 'current'
                    ? '/votes/current'
                    : getVoteStatus(vote) === 'planned'
                      ? '/votes/planned'
                      : '/votes/closed',
                )
              }
            />
          </header>
          <div className="text-white bg-blue-600 py-2 px-4 flex justify-between">
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold break-all">{vote.title}</h2>
              {getVoteStatus(vote) !== 'planned' && (
                <div className="font-semibold">
                  {getVoteStatus(vote) === 'current' ? '실시간' : '최종'} 투표율{' '}
                  {vote.votingRate}%
                </div>
              )}
            </div>
            <RemainingTime vote={vote} />
          </div>
          <ul className="flex flex-col gap-1">
            <li className="flex">
              <div className="w-20 text-gray-500">투표 시작일</div>
              <div>{getFormattedDateString(vote.from, 'DATE_TIME_KOR')}</div>
            </li>
            <li className="flex">
              <div className="w-20 text-gray-500 ">투표 종료일</div>
              <div className="font-semibold">
                {getFormattedDateString(vote.to, 'DATE_TIME_KOR')}
              </div>
            </li>
            <li className="flex">
              <div className="w-20 text-gray-500 ">후보자 수</div>
              <div>{candidates.length}명</div>
            </li>
          </ul>
          <h2 className="text-2xl font-bold">후보자 정보</h2>
          <ul className="grid grid-cols-1 md:gap-4 gap-16 md:grid-cols-2">
            {candidates.map((candidate) => (
              <CandidateItem key={candidate.id} candidate={candidate} />
            ))}
          </ul>
          {getVoteStatus(vote) === 'closed' ? (
            <StatisticsSection
              voteId={Number(voteId)}
              candidates={candidates}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 mt-16">
              {!participated && !issued ? (
                <>
                  <div>위 내용을 모두 확인하셨나요?</div>
                  <Button
                    text="투표권 발급받기"
                    onClick={() => setShowBallotIssueModal(true)}
                    fullWidth
                  />
                </>
              ) : getVoteStatus(vote) === 'current' &&
                !participated &&
                issued ? (
                <Button
                  text="투표권으로 투표하기"
                  onClick={() => setShowBallotValidationModal(true)}
                  fullWidth
                />
              ) : participated ? (
                <Button
                  text="투표 완료"
                  icon={<Check width={20} height={20} fill="white" />}
                  fullWidth
                  disabled
                />
              ) : (
                <Button text="투표 시작 전" fullWidth disabled />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
