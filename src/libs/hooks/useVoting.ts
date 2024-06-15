import { randomBytes, toBigInt, Interface } from 'ethers';
import CryptoJS from 'crypto-js';
import wc from '~/libs/circuit/witness_calculator.js';
import {
  BN256ToBin,
  BN256ToHex,
  reverseCoordinate,
  getFormattedDateString,
  BNToDecimal,
} from '~/libs/utils';
import { CONTRACT } from '~/libs/constants';
import { Ballot } from '~/libs/types';
import { encodeFunctionData, parseAbi } from 'viem';
import { bundlerActions } from 'permissionless';
import { KernelAccountClient } from '@zerodev/sdk';
import { ENTRYPOINT_ADDRESS_V07_TYPE } from 'permissionless/types';
import { getCandidateAddressOnchain } from '~/libs/contract';
import { finalVoteOnChain, getRecieptOnChain } from '~/libs/api';

const CRYPTO_SECRET = import.meta.env.VITE_CRYPTO_SECRET;

export function useVoting() {
  const preVote = async (
    kernelClient: KernelAccountClient<ENTRYPOINT_ADDRESS_V07_TYPE>,
    // startDate: Date,
  ) => {
    console.log('##### Pre-Vote #####');
    if (!kernelClient) {
      console.log('잘못된 커널 클라이언트');
      return;
    }

    const res = await fetch('/deposit.wasm');
    const buffer = await res.arrayBuffer();
    const depositWC = await wc(buffer);

    console.log('1. secret 및 nullifier 생성');
    const secret = toBigInt(randomBytes(32));
    const nullifier = toBigInt(randomBytes(32));
    console.log(
      `secret = ${secret.toString().slice(0, 8)}..., nullifier = ${nullifier.toString().slice(0, 8)}...`,
    );
    const input = {
      secret: BN256ToBin(secret).split(''),
      nullifier: BN256ToBin(nullifier).split(''),
    };
    console.log('2. commitment 및 nullifierHash 생성');
    const [_, commitment, nullifierHash] = await depositWC.calculateWitness(
      input,
      0,
    );
    console.log(
      `commitment = ${commitment.toString().slice(0, 8)}..., nullifierHash = ${nullifierHash.toString().slice(0, 8)}...`,
    );

    console.log('3. 트랜잭션 (자신의 토큰을 Mixer에 송금)');
    const userOpHash = await kernelClient.sendUserOperation({
      userOperation: {
        callData: await kernelClient.account!.encodeCallData({
          to: CONTRACT.TORNADO.ADDRESS as `0x${string}`,
          value: BigInt(0),
          data: encodeFunctionData({
            abi: CONTRACT.TORNADO.ABI,
            functionName: 'deposit',
            args: [commitment, CONTRACT.TOKEN.ADDRESS as `0x${string}`],
          }),
        }),
      },
    });
    const bundlerClient = kernelClient.extend(
      bundlerActions(kernelClient.account!.entryPoint),
    );
    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });
    console.log('투표권 발급 성공!');

    try {
      const votingAvailableDate = new Date();
      /* startDate < new Date()
          ? getRandomFutureDate(ONE_DAY_MS * 3, ONE_HOUR_MS)
          : startDate; */

      const ballot: Ballot = {
        nullifierHash: nullifierHash.toString(),
        secret: secret.toString(),
        nullifier: nullifier.toString(),
        commitment: commitment.toString(),
        txHash: receipt.receipt.transactionHash,
        votingAvailableDate,
      };

      return {
        votingAvailableDate,
        contents: CryptoJS.AES.encrypt(
          JSON.stringify(ballot),
          CRYPTO_SECRET,
        ).toString(),
      };
    } catch (e) {
      console.log(e);
    }
  };

  const finalVote = async (ballot: Ballot, index: number) => {
    try {
      console.log('##### Final-Vote #####');
      console.log('1. 투표권 유효성 확인');
      const receipt = await getRecieptOnChain(ballot.txHash);
      if (!receipt) {
        console.log('유효하지 않은 투표권입니다.');
        throw new Error('empty-receipt');
      }

      const log = receipt.logs[5];
      const tornadoInterface = new Interface(CONTRACT.TORNADO.ABI);
      const decodedData = tornadoInterface.decodeEventLog(
        'Deposit',
        log.data,
        log.topics,
      );

      console.log('2. 투표 대상 후보의 address 조회');
      const address = await getCandidateAddressOnchain(index);
      console.log(`address = ${address}`);

      const proofInput = {
        root: BNToDecimal(decodedData.root),
        nullifierHash: ballot.nullifierHash,
        recipient: BNToDecimal(address),
        secret: BN256ToBin(ballot.secret).split(''),
        nullifier: BN256ToBin(ballot.nullifier).split(''),
        hashPairings: decodedData.hashPairings.map(BNToDecimal),
        hashDirections: decodedData.pairDirection,
      };

      console.log('3. proof 객체 생성');
      const SnarkJS = window['snarkjs'];
      const { proof, publicSignals } = await SnarkJS.groth16.fullProve(
        proofInput,
        '/withdraw.wasm',
        '/setup_final.zkey',
      );
      console.log(`proof = ${proofInput}`);

      const callInputs = [
        proof.pi_a.slice(0, 2).map(BN256ToHex),
        proof.pi_b
          .slice(0, 2)
          .map((row) => reverseCoordinate(row.map(BN256ToHex)))
          .map((row) => row.toString()),
        proof.pi_c.slice(0, 2).map(BN256ToHex),
        publicSignals.slice(0, 2).map(BN256ToHex),
      ];

      console.log('4. 트랜잭션 (Mixer에 송금했던 토큰을 후보자로 인출)');
      const response = await finalVoteOnChain(
        callInputs,
        CONTRACT.TOKEN.ADDRESS,
        address,
      );
      return response;
      console.log('투표 성공!');
    } catch (e) {
      console.log(e);
    }
  };

  const validateBallot = (proofString: string) => {
    try {
      const ballot: Ballot = JSON.parse(
        CryptoJS.AES.decrypt(proofString, CRYPTO_SECRET).toString(
          CryptoJS.enc.Utf8,
        ),
        (key, value) =>
          key === 'votingAvailableDate' ? new Date(value) : value,
      );
      if (new Date(ballot.votingAvailableDate) > new Date()) {
        return `투표 가능 시각이 아닙니다.|(${getFormattedDateString(ballot.votingAvailableDate, 'DATE_TIME_KOR')}부터 투표 가능)`;
      }

      return ballot;
    } catch (e) {
      return '잘못된 투표권 파일입니다.';
    }
  };

  return { preVote, finalVote, validateBallot };
}
