import { ChangeEvent, useEffect, useState } from 'react';
import { Button } from '~/components';
import { useVoting } from '~/libs/hooks/useVoting';

export function TestPage() {
  const { preVote, validateBallot, finalVote } = useVoting();
  const [ballotUrl, setBallotUrl] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const uploadBallot = (file?: File) => {
    if (!file) return;
    setUploadedFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    uploadBallot(e.target.files?.[0]);
  };

  useEffect(() => {
    const fetchPreVote = async () => {
      const response = await preVote(1, new Date());
      if (response) {
        const { votingAvailable, contents } = response;
        const blob = new Blob([contents]);
        const url = window.URL.createObjectURL(blob);
        setBallotUrl(url);
      }
    };

    fetchPreVote();
  }, []);

  useEffect(() => {
    const fetchFinalVote = async () => {
      if (uploadedFile) {
        const contents = await uploadedFile.text();
        const ballot = validateBallot(contents);
        if (typeof ballot !== 'string') await finalVote(ballot);
      }
    };

    fetchFinalVote();
  }, [uploadedFile]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">테스트 페이지</h1>
      {ballotUrl && (
        <a href={ballotUrl} download="ballot.secret">
          <Button text="투표 증서 다운로드" />
        </a>
      )}
      <input type="file" onChange={onChange} />
    </div>
  );
}
