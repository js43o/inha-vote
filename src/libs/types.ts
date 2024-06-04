export type SortBy = 'title' | 'endDate' | 'votingRate';

export type RegisterInput = {
  name: string;
  studentNumber: string;
  carrier: 'SKT' | 'KT' | 'LG U+';
  phoneNumber: string;
};

export type Vote = {
  id: number;
  title: string;
  from: Date;
  to: Date;
  votingRate: number;
};

export type Candidate = {
  id: number;
  affiliation: string;
  name: string;
  imgSrc: string;
  profiles: { year: number; contents: string }[];
  promises: string[];
  word: string;
  elected?: boolean;
};

export type AsyncStatus = 'INITIAL' | 'LOADING' | 'SUCCESS' | 'FAILURE';

export type SimpleVoteStatistics = {
  voteId: number;
  candidates: { candidateId: number; ratio: number }[];
};

export type VoteStatistics = {
  voteId: number;
  candidates: CandidateStatistics[];
};

export type CandidateStatistics = {
  id: number;
  totalNumberOfVotes: number;
  numberOfVotesBy: NumberOfVotesBy;
};

export type NumberOfVotesBy = {
  college: {
    business: number;
    humanities: number;
    engineering: number;
    natural: number;
  };
  gender: {
    man: number;
    woman: number;
  };
};

export type Ballot = {
  nullifierHash: string;
  secret: string;
  nullifier: string;
  commitment: string;
  txHash: string;
  votingAvailableDate: Date;
};
