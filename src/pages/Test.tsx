import { useVoting } from '~/libs/hooks/useVoting';

export function TestPage() {
  const { preVote } = useVoting();

  preVote();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">테스트 페이지</h1>
    </div>
  );
}
