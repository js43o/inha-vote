import { Button, Modal } from '~/components';
import { AsyncStatus } from '~/lib/types';

type LoginFailureModalProps = {
  visible: boolean;
  result: AsyncStatus;
  onClose: () => void;
};

export function LoginFailureModal({
  visible,
  result,
  onClose,
}: LoginFailureModalProps) {
  return (
    <Modal visible={visible}>
      <>
        <h1 className="font-bold text-2xl">알림</h1>
        <div className="text-center">
          {result === 'FAILURE' ? (
            <>
              로그인에 실패했습니다.
              <br />
              다시 시도해 주세요.
            </>
          ) : (
            '처리 중...'
          )}
        </div>
        <Button text="확인" fullWidth onClick={onClose} />
      </>
    </Modal>
  );
}
