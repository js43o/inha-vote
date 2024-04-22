import { Button, Modal } from '~/components';

type BallotIssueModalProps = {
  visible: boolean;
  onIssueBallot: () => void;
  onClose: () => void;
};

export function BallotIssueModal({
  visible,
  onIssueBallot,
  onClose,
}: BallotIssueModalProps) {
  return (
    <Modal visible={visible}>
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
              <b>무작위로 투표 가능 시각이 지정</b>되며, 해당 시간 이후부터 종료
              시점 전까지 투표 가능합니다.
            </div>
          </div>
        </div>
        <div className="text-red-600 font-semibold">
          위 주의사항을 정말 확인하셨나요?
        </div>
        <div className="flex w-full gap-4">
          <Button text="취소" onClick={onClose} theme="secondary" fullWidth />
          <Button
            text="예, 투표권을 발급합니다"
            onClick={onIssueBallot}
            fullWidth
            disabled
          />
        </div>
      </>
    </Modal>
  );
}
