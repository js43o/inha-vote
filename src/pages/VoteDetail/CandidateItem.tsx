import { Candidate } from '~/lib/types';

type CandidateItemProps = {
  candidate: Candidate;
};

export function CandidateItem({
  candidate: { name, imgSrc, profiles, promises, word },
}: CandidateItemProps) {
  return (
    <li className="flex flex-col gap-4">
      <div className="flex justify-center">
        <img src={imgSrc} className="overflow-hidden w-96 rounded-xl" />
      </div>
      <div className="flex flex-col items-center">
        <div className="text-sm">컴퓨터공학과 19학번</div>
        <div className="flex items-center font-semibold gap-2">
          <div>기호 1번</div>
          <div className="text-xl font-bold">{name}</div>
        </div>
      </div>
      <div className="grid md:grid-cols-1 grid-cols-2 gap-4">
        <section className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">주요 약력</h3>
          <ul>
            {profiles.map(({ year, contents }) => (
              <li>
                <b>{year}</b> {contents}
              </li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">핵심 공약</h3>
          <ul>
            {promises.map((promise, idx) => (
              <li>
                <b>{idx + 1}.</b> {promise}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="flex flex-col gap-2">
        <h3 className="text-xl font-bold">후보자의 한마디</h3>
        <div>{word}</div>
      </section>
    </li>
  );
}
