import axios from 'axios';
import { Candidate, SimpleVoteStatistics, Vote, VoteStatistics } from './types';

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const registerAddress = async (
  studentNumber: string,
  address: string,
) => {
  try {
    // DB에 studentNumber가 존재해야 함
    const response = await client.put(`/user/${studentNumber}`, {
      Address: address,
    });

    return response.status;
  } catch (e) {
    console.log(e);
  }
};

export const getVotes = async () => {
  try {
    const response = await client.get<
      {
        VID: number;
        Topic: string;
        Start: string;
        End: string;
      }[]
    >('/vote');
    const votes: Vote[] = response.data.map(({ VID, Topic, Start, End }) => ({
      id: VID,
      title: Topic,
      from: new Date(Start),
      to: new Date(End),
      votingRate: 0, // 온체인 조회
    }));

    return votes;
  } catch (e) {
    console.log(e);
  }
};

export const getCandidates = async (voteId: number) => {
  try {
    const responseOfCandidateIds = await client.get<
      {
        CID: number;
      }[]
    >(`/vote_details/${voteId}/candidate`);
    const responseOfCandidates = await Promise.all(
      responseOfCandidateIds.data.map(({ CID }) =>
        client.get<{
          name: string;
          department: string;
          student_id: number;
          img_url: string;
          profile_lists: string[];
          content_lists: string[];
          talk: string;
        }>(`/vote_details/${voteId}/${CID}`),
      ),
    );
    const candidates: Candidate[] = responseOfCandidates.map(
      ({
        data: {
          name,
          department,
          student_id,
          img_url,
          profile_lists,
          content_lists,
          talk,
        },
      }) => ({
        id: student_id,
        affiliation: department,
        name,
        imgSrc: img_url,
        profiles: profile_lists.map((profile) => ({
          year: Number(profile.slice(0, 4)) || 2024,
          contents: profile.slice(5),
        })),
        word: talk,
        promises: content_lists,
      }),
    );

    return candidates;
  } catch (e) {
    console.log(e);
  }
};

export const getVoteResult = async (voteId: number) => {
  try {
    const response = await client.get<
      {
        CID: number;
        Ratio: number;
      }[]
    >(`/vote_details/${voteId}/results`);
    const voteStatistics: SimpleVoteStatistics = {
      voteId,
      candidates: response.data.map(({ CID, Ratio }) => ({
        candidateId: CID,
        ratio: Ratio,
      })),
    };

    return voteStatistics;
  } catch (e) {
    console.log(e);
  }
};