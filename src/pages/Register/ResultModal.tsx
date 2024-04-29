import { useNavigate } from 'react-router-dom';
import { Button, Modal } from '~/components';
import { AsyncStatus } from '~/lib/types';

type ResultModalProps = {
  visible: boolean;
  result: AsyncStatus;
  onClose: () => void;
};

export function ResultModal({ visible, result, onClose }: ResultModalProps) {
  const navigate = useNavigate();

  return (
    <Modal visible={visible}>
      <>
        <h1 className="font-bold text-2xl">알림</h1>
        <div className="text-center">
          {result === 'SUCCESS' ? (
            '성공적으로 계정을 생성했습니다.'
          ) : result === 'FAILURE' ? (
            <>
              계정 생성에 실패했습니다.
              <br />
              다시 시도해 주세요.
            </>
          ) : (
            '처리 중...'
          )}
        </div>
        <Button
          text="확인"
          fullWidth
          onClick={
            result === 'SUCCESS' ? () => navigate('/votes/current') : onClose
          }
        />
      </>
    </Modal>
  );
}
