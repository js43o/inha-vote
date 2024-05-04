import { randomHex } from 'web3-utils';
import wc from '~/libs/circuit/witness_calculator.js';

export function useVoting() {
  const BN256ToBin = (str: string) => {
    let r = BigInt(str).toString(2);
    return `${[...Array(256 - r.length)].map((_) => '0').join('')}${r}`;
  };

  const preVote = async () => {
    const secret = BigInt(randomHex(32)).toString();
    const nullifier = BigInt(randomHex(32)).toString();

    const input = {
      secret: BN256ToBin(secret).split(''),
      nullifier: BN256ToBin(nullifier).split(''),
    };

    const res = await fetch('/deposit.wasm');
    const buffer = await res.arrayBuffer();
    const depositWC = await wc(buffer);

    const r = await depositWC.calculateWitness(input, 0);

    const commitment = r[1];
    const nullifierHash = r[2];

    console.log(commitment, nullifierHash);

    const tx = {
      to: '', // Mixer 주소
      value: BigInt(0), // 투표 토큰
      /*
      data: encodeFunctionData({
        abi: '',
        functionName: '',
        args: [],
      }),
      */
    };

    // console.log(r);
  };

  return { preVote };
}
