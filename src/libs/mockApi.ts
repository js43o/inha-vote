import { Candidate, Vote, VoteStatistics } from './types';

const mockVoteList: Vote[] = [
  {
    id: 1,
    title: '2022년 자치회 선거',
    from: new Date('2022-05-20'),
    to: new Date('2022-06-25'),
    votingRate: 56.78,
  },
  {
    id: 2,
    title: '2022년 총학생회 선거',
    from: new Date('2022-05-10'),
    to: new Date('2022-06-20'),
    votingRate: 20.78,
  },
  {
    id: 3,
    title: '2023년 부회장 선거',
    from: new Date('2023-05-10'),
    to: new Date('2023-06-25'),
    votingRate: 90.78,
  },
  {
    id: 4,
    title: '2024년 자치회 선거',
    from: new Date('2024-04-10'),
    to: new Date('2024-06-21'),
    votingRate: 90.78,
  },
  {
    id: 5,
    title: '2024년 총학생회 선거',
    from: new Date('2024-04-20'),
    to: new Date('2024-06-15'),
    votingRate: 78.91,
  },
  {
    id: 6,
    title: '2024년 부회장 선거',
    from: new Date('2024-04-26'),
    to: new Date('2024-06-22'),
    votingRate: 66.55,
  },
  {
    id: 7,
    title: '2024년 부반장 선거',
    from: new Date('2024-06-20'),
    to: new Date('2024-06-26'),
    votingRate: 66.55,
  },
];

const mockCandidateList: Candidate[] = [
  {
    elected: true,
    id: 1,
    affiliation: '컴퓨터공학과 18학번',
    name: '안뇽',
    imgSrc: '/src/assets/images/annyong.png',
    profiles: [
      {
        year: 2020,
        contents: '인하대학교 컴퓨터공학과 입학',
      },
      {
        year: 2021,
        contents: '인하대학교 인공지능공학과 부회장',
      },
      {
        year: 2022,
        contents: '인하대학교 전자공학과 회장',
      },
    ],
    promises: [
      '교내 전자출결시스템 도입',
      '건물별 일일 CO2 배출량 제한',
      '학생 및 교직원 대상 무료 학식 제공',
    ],
    word: '안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까,',
  },
  {
    id: 2,
    affiliation: '컴퓨터공학과 19학번',
    name: '인덕',
    imgSrc: '/src/assets/images/induck.png',
    profiles: [
      {
        year: 2020,
        contents: '인하대학교 컴퓨터공학과 입학',
      },
      {
        year: 2021,
        contents: '인하대학교 인공지능공학과 부회장',
      },
      {
        year: 2022,
        contents: '인하대학교 전자공학과 회장',
      },
    ],
    promises: [
      '교내 전자출결시스템 도입',
      '건물별 일일 CO2 배출량 제한',
      '학생 및 교직원 대상 무료 학식 제공',
    ],
    word: '안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까,',
  },
];

const mockVoteStatistics: VoteStatistics = {
  voteId: 1,
  candidates: [
    {
      id: 1,
      totalNumberOfVotes: 70,
      numberOfVotesBy: {
        gender: { man: 30, woman: 40 },
        college: {
          business: 20,
          humanities: 15,
          engineering: 15,
          natural: 20,
        },
      },
    },
    {
      id: 2,
      totalNumberOfVotes: 30,
      numberOfVotesBy: {
        college: {
          business: 5,
          humanities: 5,
          engineering: 10,
          natural: 10,
        },
        gender: { man: 20, woman: 10 },
      },
    },
  ],
};

export const getMockVoteList = async () => {
  return mockVoteList;
};

export const getMockVote = async (id: number) => {
  return mockVoteList.find((vote) => vote.id === id);
};

export const getMockCandidateList = async () => {
  return mockCandidateList;
};

export const getMockVoteStatistics = async () => {
  return mockVoteStatistics;
};
