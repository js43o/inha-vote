import { Candidate } from '~/libs/types';
import Elected from '~/assets/icons/elected.svg?react';

type CandidateItemProps = {
  candidate: Candidate;
  elected?: boolean;
};

export function CandidateItem({
  candidate: { name, affiliation, imgSrc, profiles, promises, word },
  elected = false,
}: CandidateItemProps) {
  return (
    <li className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex self-center relative">
          {elected && (
            <div className="flex items-center gap-1 text-2xl font-bold bg-yellow-300 text-amber-700 absolute top-1 right-1 p-2 rounded-bl-lg rounded-tr-lg z-10 font-serif">
              <Elected width={32} height={32} className="fill-amber-700" />
              당선
            </div>
          )}
          <img
            src={imgSrc}
            className={`overflow-hidden shadow-md w-96 rounded-xl ${elected && 'border-8 border-yellow-300'}`}
          />
        </div>
        <div className="flex flex-col items-center">
          <p>{affiliation}</p>
          <p className="text-xl font-bold font-serif">{name}</p>
        </div>
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
