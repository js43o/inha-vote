import { Candidate } from '~/lib/types';

type CandidateItemProps = {
  candidate: Candidate;
};

export function CandidateItem({
  candidate: { name, affiliation, imgSrc, profiles, promises, word },
}: CandidateItemProps) {
  return (
    <li className="flex flex-col gap-4">
      <div className="flex justify-center">
        <img src={imgSrc} className="overflow-hidden w-96 rounded-xl" />
      </div>
      <div className="flex flex-col items-center">
        <p className="text-sm">{affiliation}</p>
        <p className="text-xl font-bold">{name}</p>
      </div>
      <div className="grid md:grid-cols-1 grid-cols-2 gap-4">
        <section className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">주요 약력</h3>
          <ul>
            {profiles.map(({ year, contents }, idx) => (
              <li key={idx}>
                <b>{year}</b> {contents}
              </li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">핵심 공약</h3>
          <ul>
            {promises.map((promise, idx) => (
              <li key={idx}>
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
