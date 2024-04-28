import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Undo from '~/assets/icons/undo.svg?react';
import { Button, Menu } from '~/components';
import { Candidate, Vote } from '~/lib/types';
import { getMockCandidateList, getMockVote } from '~/lib/mockApi';
import { CandidateItem } from './CandidateItem';
import { BallotIssueModal } from './BallotIssueModal';
import { BallotValidationModal } from './BallotValidationModal';
import { VotingModal } from './VotingModal';
import { getFormattedDateString, getVoteStatus } from '~/lib/utils';
import { ONE_DAY_MS } from '~/lib/constants';

export function VoteDetailPage() {
  const navigate = useNavigate();
  const { id: voteId } = useParams();
  const [vote, setVote] = useState<Vote>();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [remainingTime, setRemainingTime] = useState<string>('');

  const [showBallotIssueModal, setShowBallotIssueModal] = useState(false);
  const [showBallotValidationModal, setShowBallotValidationModal] =
    useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);

  useEffect(() => {
    if (!voteId) return;
    getMockVote(Number(voteId)).then((vote) => setVote(vote));
    getMockCandidateList().then((candidates) => setCandidates(candidates));
  }, [voteId]);

  useEffect(() => {
    if (vote && getVoteStatus(vote) === 'current' && !remainingTime) {
      window.setInterval(
        () =>
          setRemainingTime(
            getFormattedDateString(
              new Date(vote.to.getTime() - Date.now()),
              'TIME_COLON',
            ),
          ),
        1000,
      );
    }
  }, [vote, remainingTime]);

  if (!vote || !candidates) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BallotIssueModal
        visible={showBallotIssueModal}
        onIssueBallot={() => {}}
        onClose={() => setShowBallotIssueModal(false)}
      />
      <BallotValidationModal
        visible={showBallotValidationModal}
        onShowVotingModal={() => setShowVotingModal(true)}
        onClose={() => setShowBallotValidationModal(false)}
      />
      <VotingModal
        visible={showVotingModal}
        onClose={() => setShowVotingModal(false)}
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
              onClick={() => navigate('/vote/current')}
            />
          </header>
          <div className="text-white bg-blue-600 py-2 px-4 flex justify-between">
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-semibold">{vote.title}</h2>
              {getVoteStatus(vote) !== 'planned' && (
                <div className="font-semibold">
                  {getVoteStatus(vote) === 'current' ? '실시간' : '최종'} 투표율{' '}
                  {vote.votingRate}%
                </div>
              )}
            </div>
            <div className="sm:flex flex-col items-end justify-center hidden">
              {getVoteStatus(vote) === 'current' ? (
                <>
                  <div>투표 종료까지</div>
                  <div className="text-3xl font-semibold leading-none">
                    {remainingTime}
                  </div>
                </>
              ) : getVoteStatus(vote) === 'planned' ? (
                <>
                  <div>투표 개시까지</div>
                  <div className="text-3xl font-semibold leading-none">
                    D-
                    {Math.ceil(
                      new Date(vote.from.getTime() - Date.now()).getTime() /
                        ONE_DAY_MS,
                    )}
                  </div>
                </>
              ) : (
                <div>종료됨</div>
              )}
            </div>
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
          <div className="flex flex-col items-center gap-2 mt-16">
            <div>위 내용을 모두 확인하셨나요?</div>
            <Button
              text="투표권 발급받기"
              onClick={() => setShowBallotIssueModal(true)}
              fullWidth
            />
          </div>
        </main>
      </div>
    </>
  );
}
