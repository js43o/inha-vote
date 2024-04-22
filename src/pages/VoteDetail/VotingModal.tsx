import { useState } from 'react';
import { Button, Modal, ToggleInput } from '~/components';

type VotingModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function VotingModal({ visible, onClose }: VotingModalProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const onSelect = (index: number) => setSelected(index);

  return (
    <Modal visible={visible}>
      <>
        <div className="text-2xl font-bold">투표하기</div>
        <ul className="w-full flex flex-col gap-4">
          <li className="flex items-center gap-4">
            <div className="bg-blue-800 w-20 h-20 rounded-xl" />
            <div className="flex flex-col grow items-start">
              <p>기호 1번</p>
              <p className="text-lg font-semibold">안뇽</p>
            </div>
            <ToggleInput
              checked={selected === 0}
              onToggle={() => onSelect(0)}
            />
          </li>
          <li className="flex items-center gap-4">
            <div className="bg-sky-500 w-20 h-20 rounded-xl" />
            <div className="flex flex-col grow items-start">
              <p>기호 2번</p>
              <p className="text-lg font-semibold">인덕</p>
            </div>
            <ToggleInput
              checked={selected === 1}
              onToggle={() => onSelect(1)}
            />
          </li>
        </ul>
        <div
          className={`flex flex-col gap-2 items-center overflow-hidden ${selected === null ? 'h-0' : 'h-auto'}`}
        >
          <p className="text-center font-semibold text-red-600">
            해당 결정은 취소할 수 없으며,
            <br />
            실제 투표 반영까지는 몇 분 정도 소요될 수 있습니다.
          </p>
          <p>확인했다면 '결정' 버튼을 누르세요.</p>
        </div>
        <div className="flex w-full gap-2">
          <Button text="취소" onClick={onClose} theme="secondary" fullWidth />
          <Button text="결정" fullWidth disabled={selected === null} />
        </div>
      </>
    </Modal>
  );
}
