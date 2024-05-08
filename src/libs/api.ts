import axios from 'axios';
import { Candidate, SimpleVoteStatistics, Vote, VoteStatistics } from './types';

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const register = async (studentNumber: string, address: string) => {
  try {
    const response = await client.put(`/user/${studentNumber}`, {
      Id: address,
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
    const responseOfCandidates = await client.get<
      {
        CID: number;
        Name: string;
        Img: string;
        Profile: string;
      }[]
    >(`/vote_details/${voteId}/candidate`);
    const responseOfPromises = await Promise.all(
      responseOfCandidates.data.map(({ CID }) =>
        client.get<{ Content: string }[]>(`/vote_details/${voteId}/${CID}`),
      ),
    );
    const candidates: Candidate[] = responseOfCandidates.data.map(
      ({ CID, Name, Img, Profile }, idx) => ({
        id: CID,
        affiliation: '',
        name: Name,
        imgSrc: Img,
        profiles: [
          { year: Number(Profile.slice(0, 4)), contents: Profile.slice(5) },
        ],
        word: '',
        promises: responseOfPromises[idx].data.map(({ Content }) => Content),
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
