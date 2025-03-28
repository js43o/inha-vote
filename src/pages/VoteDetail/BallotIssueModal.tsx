import { useState } from 'react';
import { Button, Modal } from '~/components';
import { useVoting } from '~/libs/hooks/useVoting';
import { getFormattedDateString } from '~/libs/utils';
import { Vote } from '~/libs/types';
import Progress from '~/assets/icons/progress.svg?react';
import CheckCircle from '~/assets/icons/check_circle.svg?react';
import { useAtom } from 'jotai';
import { kernelClientAtomKey } from '~/libs/atom';
import { useNavigate } from 'react-router-dom';

type BallotIssueModalProps = {
  vote: Vote;
  visible: boolean;
  onClose: () => void;
};

export function BallotIssueModal({
  // vote,
  visible,
  onClose,
}: BallotIssueModalProps) {
  const [loading, setLoading] = useState(false);
  const [ballotUrl, setBallotUrl] = useState<string>('');
  const [availableDate, setAvailableDate] = useState('');
  const [kernelClientAtom, setKernelClientAtom] = useAtom(kernelClientAtomKey);
  const { preVote } = useVoting();
  const navigate = useNavigate();

  const onIssueBallot = async () => {
    if (!kernelClientAtom) {
      navigate('/login');
      return;
    }

    setLoading(true);
    const response = await preVote(kernelClientAtom /*, from */);
    if (!response) return;

    const { votingAvailableDate, contents } = response;
    const blob = new Blob([contents]);
    const url = window.URL.createObjectURL(blob);

    setAvailableDate(
      getFormattedDateString(votingAvailableDate, 'DATE_TIME_KOR'),
    );
    setBallotUrl(url);
    setLoading(false);
  };

  return (
    <Modal visible={visible}>
      {!ballotUrl ? (
        <>
          <div className="text-2xl font-bold">투표권 발급 시 주의사항</div>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-lg">
                1. 발급된 투표권 파일을 분실하지 마세요.
              </div>
              <div>
                투표권은 인당 한 번씩만 발급되며, 분실 시 재발급이 불가능합니다.
                분실 시 책임은 본인에게 있습니다.
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-lg">
                2. 지정된 투표 시각 이후에 투표할 수 있습니다.
              </div>
              <div>
                익명성을 보장하기 위해 투표권 발급 시{' '}
                <b>무작위로 투표 가능 시각이 지정</b>되며, 해당 시간 이후부터
                종료 시점 전까지 투표 가능합니다.
              </div>
            </div>
          </div>
          <div className="text-danger font-semibold">
            위 주의사항을 정말 확인하셨나요?
          </div>
          <div className="flex w-full gap-2">
            <Button text="취소" onClick={onClose} theme="secondary" fullWidth />
            <Button
              text={loading ? '발급 중...' : '예, 투표권을 발급합니다'}
              onClick={onIssueBallot}
              fullWidth
              icon={
                loading ? (
                  <Progress
                    className="animate-spin-fast"
                    width={20}
                    height={20}
                    fill="white"
                  />
                ) : undefined
              }
              disabled={loading}
            />
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl font-bold">투표권 발급됨</div>
          <CheckCircle className="w-24 h-24 fill-blue-300 animate-completed" />
          <div className="flex flex-col items-center gap-1">
            <p>
              투표 가능 시각은{' '}
              <b className="font-semibold text-danger">{availableDate}</b>
              부터입니다.
            </p>
            <p>하단의 버튼을 눌러서 발급된 투표권을 다운로드하세요.</p>
          </div>
          <a href={ballotUrl} download="ballot.secret" className="w-full">
            <Button text="투표권 다운로드" fullWidth onClick={onClose} />
          </a>
        </>
      )}
    </Modal>
  );
}
