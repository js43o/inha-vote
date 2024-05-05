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

export type Gender = 'MAN' | 'WOMAN';

export type College = 'BUSINESS' | 'HUMANITIES' | 'ENGINEERING';

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

export type VotingProof = {
  nullifierHash: string;
  secret: bigint;
  nullifier: bigint;
  commitment: string;
  txHash: string;
  votingAvailable: Date;
};
