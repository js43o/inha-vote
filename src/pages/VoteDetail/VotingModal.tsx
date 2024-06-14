import { useAtom } from 'jotai';
import { ChangeEvent, DragEvent, useState } from 'react';
import Upload from '~/assets/icons/upload.svg?react';
import { Button, Modal, ToggleInput } from '~/components';
import { kernelClientAtomKey } from '~/libs/atom';
import { useVoting } from '~/libs/hooks/useVoting';
import { Candidate, Vote, Ballot } from '~/libs/types';

type BallotValidationModalProps = {
  vote: Vote;
  candidates: Candidate[];
  visible: boolean;
  onClose: () => void;
};

export function BallotValidationModal({
  candidates,
  visible,
  onClose,
}: BallotValidationModalProps) {
  const [ballot, setBallot] = useState<Ballot | null>(null);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null,
  );
  const [kernelClientAtom, setKernelClientAtom] = useAtom(kernelClientAtomKey);
  const { validateBallot, finalVote } = useVoting();

  const uploadBallot = async (file?: File) => {
    setError('');
    if (!file) return;

    const contents = await file.text();
    const ballot = validateBallot(contents);
    if (typeof ballot === 'string') {
      setError(ballot);
      return;
    }

    console.log(ballot);

    setBallot(ballot);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    uploadBallot(e.dataTransfer.files[0]);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    uploadBallot(e.target.files?.[0]);
  };

  const onSelectCandidate = (index: number) => setSelectedCandidate(index);

  const onCloseModal = () => {
    setBallot(null);
    setError('');
    setSelectedCandidate(null);
    onClose();
  };

  const onFinalVote = async () => {
    if (kernelClientAtom && ballot && selectedCandidate !== null) {
      await finalVote(kernelClientAtom, ballot, selectedCandidate);
    }

    onCloseModal();
  };

  return (
    <Modal visible={visible}>
      {!ballot ? (
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
          {error && (
            <p className="font-semibold text-danger text-center">
              {error.split('|').map((str, idx) => (
                <span key={idx}>
                  {str}
                  {idx < error.split('|').length - 1 && <br />}
                </span>
              ))}
            </p>
          )}
          <div className="flex w-full gap-2">
            <Button
              text="취소"
              onClick={onCloseModal}
              theme="secondary"
              fullWidth
            />
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl font-bold">최종 후보 선택</div>
          <ul className="w-full flex flex-col gap-4">
            {candidates.map((candidate, idx) => (
              <li key={candidate.id} className="flex items-center gap-4">
                <img
                  src={candidate.imgSrc}
                  className="overflow-hidden w-20 h-20 rounded-xl"
                />
                <div className="flex flex-col grow items-start">
                  <p className="text-sm">{candidate.affiliation}</p>
                  <p className="text-lg font-semibold">{candidate.name}</p>
                </div>
                <ToggleInput
                  text="선택"
                  checked={selectedCandidate === idx}
                  onToggle={() => onSelectCandidate(idx)}
                />
              </li>
            ))}
          </ul>
          <div
            className={`flex flex-col gap-2 items-center overflow-hidden ${selectedCandidate === null ? 'h-0' : 'h-auto'}`}
          >
            <p className="text-center font-semibold text-danger">
              해당 결정은 취소할 수 없으며,
              <br />
              실제 투표수 반영까지는 몇 분 정도 소요될 수 있습니다.
            </p>
            <p>모두 확인했다면 '결정' 버튼을 누르세요.</p>
          </div>
          <div className="flex w-full gap-2">
            <Button
              text="취소"
              onClick={onCloseModal}
              theme="secondary"
              fullWidth
            />
            <Button
              text="결정"
              fullWidth
              disabled={selectedCandidate === null}
              onClick={onFinalVote}
            />
          </div>
        </>
      )}
    </Modal>
  );
}
