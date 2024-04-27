export type SortBy = 'title' | 'endDate' | 'votingRate';
export type RegisterInput = {
  name: string;
  studentNumber: string;
  password: string;
  passwordConfirm: string;
  carrier: 'SKT' | 'KT' | 'LG U+';
  phoneNumber: string;
};
