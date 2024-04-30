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
