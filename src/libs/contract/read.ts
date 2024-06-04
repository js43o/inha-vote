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
