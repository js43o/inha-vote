import Calendar from '~/assets/icons/calendar.svg?react';
import Vote from '~/assets/icons/vote.svg?react';
import Register from '~/assets/icons/register.svg?react';
import { SortBy } from './types';
import { parseAbi } from 'viem';

export const ONE_MINUTE_MS = 1000 * 60;
export const ONE_HOUR_MS = ONE_MINUTE_MS * 60;
export const ONE_DAY_MS = ONE_HOUR_MS * 24;

export const MENU_ITEMS = [
  { title: '예정된 투표', path: '/votes/planned', Icon: Calendar },
  { title: '진행 중인 투표', path: '/votes/current', Icon: Vote },
  { title: '종료된 투표', path: '/votes/closed', Icon: Register },
];

export const SORT_BY: { title: string; name: SortBy }[] = [
  { title: '제목순', name: 'title' },
  { title: '종료일순', name: 'endDate' },
  { title: '투표율순', name: 'votingRate' },
];

export const DAY_NAME_KOR = ['일', '월', '화', '수', '목', '금', '토'];

export const CONTRACT = {
  VOTING_BOX: {
    ADDRESS: '0xD4d6A26CdeAb40F61C430aB25baEb2C0c23b88aD',
    ABI: parseAbi([
      'function studentSaltTable(uint) public view returns (uint)',
      'function owner() public view returns (address)',
    ]),
  },
  TOKEN: {
    ADDRESS: '0x4C8c9967f90E0C66452ca3577639187A3b3e9eF3',
  },
  TORNADO: {
    ADDRESS: '0xF93da63aC52634D1996AC0dE7EdFd3fa5dcF5cd6',
    ABI: parseAbi([
      'function deposit(uint256 _commitment, address tokenAddress) external',
    ]),
  },
};
