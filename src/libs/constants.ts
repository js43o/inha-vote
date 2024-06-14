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
    ADDRESS: '0x6a779Ee772D8244C34BdDd9d912cc7932D297620',
    ABI: parseAbi([
      'function studentSaltTable(uint) public view returns (uint)',
      'function candidateTable(uint) public view returns (address)',
      'function owner() public view returns (address)',
    ]),
  },
  TOKEN: {
    ADDRESS: '0x599Aac16ade739afbEE573DCf7349152632d6f8A',
    // ABI: parseAbi([]),
  },
  TORNADO: {
    ADDRESS: '0x0AD76d72c849991178B4A98449eECE90859542Db',
    ABI: parseAbi([
      'function deposit(uint256 _commitment, address tokenAddress) external',
      `function withdraw(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, address tokenAddress, address candidate) external`,
      `event Deposit(uint256 root, uint256[10] hashPairings, uint8[10] pairDirection)`,
      `event Withdrawal(address to, uint256 nullifierHash)`,
      'function check(address, address) public view returns(bool)',
    ]),
  },
};
