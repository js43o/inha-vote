import { DAY_NAME_KOR } from './constants';
import { Vote } from './types';

export const fillZero = (input: string, digit: number) => {
  return input.length < digit
    ? `${[...Array(digit - input.length)].map((_) => '0').join('')}${input}`
    : input;
};

export const getFormattedDateString = (
  date: Date,
  format: 'DATE_TIME_KOR' | 'DATE_HYPHEN' | 'TIME_COLON',
) => {
  switch (format) {
    case 'DATE_TIME_KOR':
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일(${DAY_NAME_KOR[date.getDay()]})
  ${fillZero(String(date.getHours()), 2)}:${fillZero(String(date.getMinutes()), 2)}`;
    case 'DATE_HYPHEN':
      return `${date.getFullYear()}-${fillZero(String(date.getMonth() + 1), 2)}-${fillZero(String(date.getDate()), 2)}`;
    case 'TIME_COLON':
      return `${fillZero(String(Math.floor(date.getTime() / (1000 * 60 * 60))), 2)}:${fillZero(String(Math.floor((date.getTime() % (1000 * 60 * 60)) / (1000 * 60))), 2)}:${fillZero(String(Math.floor((date.getTime() % (1000 * 60)) / 1000)), 2)}`;
  }
};

export const getVoteStatus = ({ from, to }: Vote) => {
  const currentDate = new Date();
  return from < currentDate && to > currentDate
    ? 'current'
    : from > currentDate
      ? 'planned'
      : 'closed';
};

export const BN256ToBin = (bn: bigint | string) => {
  let r = typeof bn === 'string' ? BigInt(bn).toString(2) : bn.toString(2);
  return `${[...Array(256 - r.length)].map((_) => '0').join('')}${r}`;
};

export const BN256ToHex = (bn: bigint | string) => {
  let str = typeof bn === 'string' ? BigInt(bn).toString(16) : bn.toString(16);
  str = `0x${str}${[...Array(64 - str.length)].map((_) => '0').join('')}`;
  return str;
};

export const BNToDecimal = (bn: bigint | string) => {
  return typeof bn === 'string' ? BigInt(bn).toString() : bn.toString();
};

export const reverseCoordinate = (p: string[]) => {
  let r = Array<bigint>(2);
  r[0] = BigInt(p[1]);
  r[1] = BigInt(p[0]);
  return r;
};

export const getRandomFutureDate = (maxMs: number, minMs: number) => {
  const ms = Math.min(minMs + Math.random() * maxMs, maxMs);
  return new Date(Date.now() + ms);
};
