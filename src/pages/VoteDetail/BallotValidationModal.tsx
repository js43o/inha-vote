import { ChangeEvent, DragEvent, useState } from 'react';
import { Button, Modal } from '~/components';
import Upload from '~/assets/icons/upload.svg?react';

type BallotValidationModalProps = {
  visible: boolean;
  onShowVotingModal: () => void;
  onClose: () => void;
};

export function BallotValidationModal({
  visible,
  onClose,
  onShowVotingModal,
}: BallotValidationModalProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const uploadBallot = (file?: File) => {
    if (!file) return;

    setUploadedFile(file);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    uploadBallot(e.dataTransfer.files[0]);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    uploadBallot(e.target.files?.[0]);
  };

  const onNext = () => {
    onClose();
    onShowVotingModal();
  };

  return (
    <Modal visible={visible}>
      <>
        <div className="text-2xl font-bold">투표권 확인</div>
        <div>발급받은 투표권 파일을 업로드해 주세요.</div>
        <label
          className="group flex items-center justify-center p-4 w-full h-32 border border-dashed border-gray-500 rounded-xl hover:border-gray-400 active:border-gray-600"
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input type="file" className="hidden" onChange={onChange} />
          <div className="flex items-center gap-1 text-gray-500 fill-gray-500 group-hover:text-gray-400 group-hover:fill-gray-400 group-active:text-gray-600 group-active:fill-gray-600">
            <Upload width={32} height={32} />
            클릭 또는 드래그
          </div>
        </label>
        <p>{uploadedFile?.name}</p>
        <div className="flex w-full gap-2">
          <Button text="취소" onClick={onClose} theme="secondary" fullWidth />
          <Button text="다음" onClick={onNext} fullWidth disabled />
        </div>
      </>
    </Modal>
  );
}
