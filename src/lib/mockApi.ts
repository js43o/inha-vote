const mockVoteList = [
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
    to: new Date('2024-06-25'),
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
    from: new Date('2024-04-20'),
    to: new Date('2024-06-01'),
    votingRate: 66.55,
  },
  {
    id: 7,
    title: '2024년 부반장 선거',
    from: new Date('2024-06-20'),
    to: new Date('2024-07-01'),
    votingRate: 66.55,
  },
];

export const getMockVoteList = async () => {
  return mockVoteList;
};
