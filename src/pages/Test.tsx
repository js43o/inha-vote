import { useAtom } from 'jotai';
import { ChangeEvent, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '~/components';
import { kernelClientAtomKey } from '~/libs/atom';
import { usePassKey } from '~/libs/hooks';
import { useVoting } from '~/libs/hooks/useVoting';

export function TestPage() {
  const { loginPasskey } = usePassKey();
  const { preVote, finalVote, validateBallot } = useVoting();
  const [ballotUrl, setBallotUrl] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [kernelClientAtom, setKernelClientAtom] = useAtom(kernelClientAtomKey);

  const uploadBallot = (file?: File) => {
    if (!file) return;
    setUploadedFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    uploadBallot(e.target.files?.[0]);
  };

  const onPreVote = async () => {
    const kernelClient = await loginPasskey();
    if (!kernelClient) {
      throw new Error('preVote - 로그인 실패');
    }

    console.log('kernelClient:', kernelClient);

    const response = await preVote(kernelClient, new Date());
    if (response && !ballotUrl) {
      const { contents } = response;
      const blob = new Blob([contents]);
      const url = window.URL.createObjectURL(blob);
      setBallotUrl(url);
    }
  };

  const onFinalVote = async () => {
    if (uploadedFile) {
      const contents = await uploadedFile.text();
      const ballot = validateBallot(contents);
      if (typeof ballot !== 'string') await finalVote(ballot);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">테스트 페이지</h1>
      {ballotUrl && (
        <a href={ballotUrl} download="ballot.secret">
          <Button text="투표 증서 다운로드" />
        </a>
      )}
      <input type="file" onChange={onChange} />
      <Button text="preVote" onClick={onPreVote} />
      <Button text="finalVote" onClick={onFinalVote} />
      {kernelClientAtom?.account?.address}
      <NavLink to="/votes/current">이동</NavLink>
    </div>
  );
}
