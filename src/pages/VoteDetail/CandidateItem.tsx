import { Candidate } from '~/libs/types';
import Release from '~/assets/icons/release.svg?react';

type CandidateItemProps = {
  candidate: Candidate;
};

export function CandidateItem({
  candidate: { name, affiliation, imgSrc, profiles, promises, word, elected },
}: CandidateItemProps) {
  return (
    <li className="flex flex-col gap-4">
      <div className="flex justify-center self-center relative">
        {elected && (
          <div className="flex items-center gap-1 text-2xl font-bold text-amber-400 absolute top-4 right-5 z-10">
            <Release width={48} height={48} className="fill-amber-400" />
            당선
          </div>
        )}
        <img
          src={imgSrc}
          className={`overflow-hidden w-96 rounded-2xl ${elected && 'border-8 border-amber-400'}`}
        />
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
