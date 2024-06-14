import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Undo from '~/assets/icons/undo.svg?react';
import Check from '~/assets/icons/check.svg?react';
import { Button } from '~/components';
import { Candidate, Vote } from '~/libs/types';
import { getFormattedDateString, getVoteStatus } from '~/libs/utils';
import { CandidateItem } from './CandidateItem';
import { BallotIssueModal } from './BallotIssueModal';
import { BallotValidationModal } from './VotingModal';
import { RemainingTime } from './RemainingTime';
import { StatisticsSection } from './StatisticsSection';
import { checkBallotIssuedOnchain } from '~/libs/contract';
import { useAtom } from 'jotai';
import { kernelClientAtomKey } from '~/libs/atom';
import { getCandidates, getVotes } from '~/libs/api';

export function VoteDetailPage() {
  const navigate = useNavigate();
  const { id: voteId } = useParams();
  const [vote, setVote] = useState<Vote>();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const participated = false; // 투표 여부 (알 수 없음)
  const [issued, setIssued] = useState(false); // 온체인 투표권 발급 여부

  const [showBallotIssueModal, setShowBallotIssueModal] = useState(false);
  const [showBallotValidationModal, setShowBallotValidationModal] =
    useState(false);
  const [kernelClientAtom, setKernelClientAtom] = useAtom(kernelClientAtomKey);

  useEffect(() => {
    const fetchData = async () => {
      if (!voteId) return;
      if (!kernelClientAtom || !kernelClientAtom.account) {
        return navigate('/login');
      }

      const vote = (await getVotes())?.find(
        (vote) => vote.id === Number(voteId),
      );
      setVote(vote);
      const candidates = await getCandidates(Number(voteId));
      setCandidates(candidates || []);

      const address = kernelClientAtom.account?.address;
      const issued = await checkBallotIssuedOnchain(address);
      setIssued(issued);
    };

    fetchData();
  }, [kernelClientAtom, voteId, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!kernelClientAtom || !kernelClientAtom.account) {
        return navigate('/login');
      }

      const address = kernelClientAtom.account?.address;
      const issued = await checkBallotIssuedOnchain(address);
      setIssued(issued);
    };

    fetchData();
  }, [showBallotIssueModal, kernelClientAtom, navigate]);

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
        vote={vote}
        candidates={candidates}
        visible={showBallotValidationModal}
        onClose={() => setShowBallotValidationModal(false)}
      />
      <main className="flex flex-col gap-6">
        <header className="flex justify-between gap-1 px-4 md:px-8">
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
        <div
          className={`text-white ${getVoteStatus(vote) === 'current' ? 'bg-blue-600' : 'bg-gray-500'} py-3 flex justify-between px-4 md:px-8 shadow-md`}
        >
          <div className="flex flex-col justify-center leading-tight">
            <h2 className="text-2xl font-bold break-all font-serif">
              {vote.title}
            </h2>
            {getVoteStatus(vote) !== 'planned' && (
              <div className="font-semibold">
                {getVoteStatus(vote) === 'current' ? '실시간' : '최종'} 투표율{' '}
                {vote.votingRate}%
              </div>
            )}
          </div>
          <RemainingTime vote={vote} />
        </div>
        <ul className="flex flex-col gap-1 px-4 md:px-8">
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
        <h2 className="text-2xl font-bold px-4 md:px-8">후보자 정보</h2>
        <ul className="grid grid-cols-1 md:gap-4 gap-16 md:grid-cols-2 px-4 md:px-8">
          {candidates.map((candidate) => (
            <CandidateItem key={candidate.id} candidate={candidate} />
          ))}
        </ul>
        {getVoteStatus(vote) === 'closed' ? (
          <StatisticsSection voteId={Number(voteId)} candidates={candidates} />
        ) : (
          <div className="flex flex-col items-center gap-2 mt-16 px-4 md:px-8">
            {!issued ? (
              <>
                <div>위 내용을 모두 확인하셨나요?</div>
                <Button
                  text="투표권 발급받기"
                  onClick={() => setShowBallotIssueModal(true)}
                  fullWidth
                />
              </>
            ) : getVoteStatus(vote) === 'current' && !participated && issued ? (
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
    </>
  );
}
