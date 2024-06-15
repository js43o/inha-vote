import axios from 'axios';
import { Candidate, SimpleVoteStatistics, Vote } from './types';
import { getNumberOfVoteOnChain } from './contract';

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const registerAddress = async (
  studentNumber: string,
  address: string,
) => {
  try {
    // DB에 studentNumber가 이미 존재해야 함
    const response = await client.put(`/user/${studentNumber}/address`, {
      Address: address,
    });

    return response.status;
  } catch (e) {
    console.log(e);
  }
};

export const getUser = async (studentNumber: string) => {
  try {
    const response = await client.get<{
      UID: number;
      Code: number;
      Address: string;
      Salt: string;
      Dep: string;
    }>(`/user/${studentNumber}`);
    const { UID, Code, Address, Salt, Dep } = response.data;
    return {
      id: UID,
      studentNumber: Code,
      address: Address,
      salt: Salt,
      department: Dep,
    };
  } catch (e) {
    console.log(e);
  }
};

export const registerSalt = async (studentNumber: string, salt: string) => {
  try {
    // DB에 studentNumber가 존재해야 함
    const response = await client.put(`/user/${studentNumber}/salt`, {
      Salt: salt,
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

// 블록체인 서버 API

export const registerStudentNumberToOnChain = async (studentNumber: string) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${import.meta.env.VITE_CHAIN_API_URL}allocateAddress?code=${studentNumber}`,
      timeout: 60 * 1000,
    });
    return response.status;
  } catch (e) {
    console.log(e);
  }
};

export const getRecieptOnChain = async (txHash: string) => {
  const response = await axios({
    url: import.meta.env.VITE_RPC,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash],
      id: 1,
    },
  });

  return response.data.result;
};

export const finalVoteOnChain = async (
  callInputs: (string[] | string[][])[],
  tokenAddress: string,
  candidateAddress: string,
) => {
  const response = await axios({
    url: `${import.meta.env.VITE_CHAIN_API_URL}finalVote`,
    method: 'POST',
    data: {
      callInputs,
      tokenAddress,
      candidateAddress,
    },
  });

  return response.status;
};

export const getNumberOfVoteOfCandidates = async (voteId: number) => {
  const candidates = await getCandidates(voteId);
  if (!candidates) return;

  const users = await Promise.all(
    candidates.map((candidate) => getUser(candidate.id.toString())),
  );
  const numberOfVoteOfCandidates = await Promise.all(
    users
      .filter((user) => !!user)
      .map((user) => getNumberOfVoteOnChain(user!.address as `0x${string}`)),
  );

  return numberOfVoteOfCandidates;
};

export const getVoteRate = async (voteId: number) => {
  const numberOfVoteOfCandidates = await getNumberOfVoteOfCandidates(voteId);
  if (!numberOfVoteOfCandidates) return;

  return numberOfVoteOfCandidates.reduce((acc, cur) => acc + cur, 0);
};
