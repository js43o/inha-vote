import { useEffect, useState } from 'react';
import { useVoting } from '~/libs/hooks/useVoting';

export function TestPage() {
  const { preVote, finalVote } = useVoting();
  const [votingProofString, setVotingProofString] = useState('');

  useEffect(() => {
    const fetchPreVote = async () => {
      const response = await preVote();
      if (response) {
        setVotingProofString(response);
        await finalVote(response);
      }
    };

    fetchPreVote();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">테스트 페이지</h1>
      <div className="overflow-hidden text-ellipsis">{votingProofString}</div>
    </div>
  );
}
