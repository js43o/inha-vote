import { DAY_NAME_KOR } from './constants';

export const getFormattedDateString = (
  date: Date,
  format: 'DATE_TIME_KOR' | 'DATE_HYPHEN',
) => {
  switch (format) {
    case 'DATE_TIME_KOR':
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일(${DAY_NAME_KOR[date.getDay()]})
  ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
    case 'DATE_HYPHEN':
      return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
  }
};
