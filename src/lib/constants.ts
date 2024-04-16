import Calendar from '~/assets/icons/calendar.svg?react';
import Vote from '~/assets/icons/vote.svg?react';
import Register from '~/assets/icons/register.svg?react';

export const MENU_ITEMS = [
  { title: '예정된 투표', path: '/vote/planned', Icon: Calendar },
  { title: '진행 중인 투표', path: '/vote/current', Icon: Vote },
  { title: '종료된 투표', path: '/vote/closed', Icon: Register },
];

export const SORT_TYPE = [
  { title: '제목순', name: 'title' },
  { title: '종료일순', name: 'endDate' },
  { title: '투표일순', name: 'votingRate' },
];
