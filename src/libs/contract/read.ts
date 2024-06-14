import { CONTRACT } from '../constants';
import { getPublicClient } from './client';

export async function getSaltOnchain(studentNumber: string) {
  const data = await getPublicClient().readContract({
    address: CONTRACT.VOTING_BOX.ADDRESS as `0x${string}`,
    abi: CONTRACT.VOTING_BOX.ABI,
    functionName: 'studentSaltTable',
    args: [BigInt(studentNumber)],
  });

  return data;
}

export async function getCandidateAddressOnchain(index: number) {
  const data = await getPublicClient().readContract({
    address: CONTRACT.VOTING_BOX.ADDRESS as `0x${string}`,
    abi: CONTRACT.VOTING_BOX.ABI,
    functionName: 'candidateTable',
    args: [BigInt(index)],
  });

  return data;
}

export async function checkBallotIssuedOnchain(address: `0x${string}`) {
  const data = await getPublicClient().readContract({
    address: CONTRACT.TORNADO.ADDRESS as `0x${string}`,
    abi: CONTRACT.TORNADO.ABI,
    functionName: 'check',
    args: [address, CONTRACT.TOKEN.ADDRESS as `0x${string}`],
  });

  return data;
}
