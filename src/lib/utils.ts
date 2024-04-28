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
