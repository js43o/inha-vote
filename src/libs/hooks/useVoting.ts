import { randomBytes, toBigInt, Interface } from 'ethers';
import CryptoJS from 'crypto-js';
import wc from '~/libs/circuit/witness_calculator.js';
import {
  BN256ToBin,
  BN256ToHex,
  getRandomFutureDate,
  reverseCoordinate,
  getFormattedDateString,
  BNToDecimal,
} from '~/libs/utils';
import { CONTRACT, ONE_DAY_MS, ONE_HOUR_MS } from '~/libs/constants';
import { Ballot } from '~/libs/types';
import { encodeFunctionData, parseAbi } from 'viem';
import { bundlerActions } from 'permissionless';
import { KernelAccountClient } from '@zerodev/sdk';
import { ENTRYPOINT_ADDRESS_V07_TYPE } from 'permissionless/types';
import { getCandidateAddressOnchain } from '../contract';
import { getRecieptOnChain, getTornado } from '../api';

const CRYPTO_SECRET = import.meta.env.VITE_CRYPTO_SECRET;

export function useVoting() {
  const preVote = async (
    kernelClient: KernelAccountClient<ENTRYPOINT_ADDRESS_V07_TYPE>,
    startDate: Date,
  ) => {
    if (!kernelClient) {
      console.log('잘못된 커널 클라이언트');
      return;
    }

    const res = await fetch('/deposit.wasm');
    const buffer = await res.arrayBuffer();
    const depositWC = await wc(buffer);

    const secret = toBigInt(randomBytes(32));
    const nullifier = toBigInt(randomBytes(32));
    const input = {
      secret: BN256ToBin(secret).split(''),
      nullifier: BN256ToBin(nullifier).split(''),
    };
    const [_, commitment, nullifierHash] = await depositWC.calculateWitness(
      input,
      0,
    );

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

  const finalVote = async (
    kernelClient: KernelAccountClient<ENTRYPOINT_ADDRESS_V07_TYPE>,
    ballot: Ballot,
    index: number,
  ) => {
    try {
      const receipt = await getRecieptOnChain(ballot.txHash);
      if (!receipt) {
        throw 'empty-receipt';
      }

      console.log(receipt.logs);
      const log = receipt.logs[5];

      const tornadoABI = parseAbi([
        `function withdraw(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, address tokenAddress, address candidate) external`,
        `function deposit(uint256 _commitment, address tokenAddress) external`,
        `event Deposit(uint256 root, uint256[10] hashPairings, uint8[10] pairDirection)`,
        `event Withdrawal(address to, uint256 nullifierHash)`,
      ]);

      // ABI 추출
      // const tornadoABI = tornadoArtifact.abi;

      // 인터페이스 생성
      const tornadoInterface = new Interface(tornadoABI);
      const decodedData = tornadoInterface.decodeEventLog(
        'Deposit',
        log.data,
        log.topics,
      );

      const address = await getCandidateAddressOnchain(index);
      const proofInput = {
        root: BNToDecimal(decodedData.root),
        nullifierHash: ballot.nullifierHash,
        recipient: BNToDecimal(address),
        secret: BN256ToBin(ballot.secret).split(''),
        nullifier: BN256ToBin(ballot.nullifier).split(''),
        hashPairings: decodedData.hashPairings.map(BNToDecimal),
        hashDirections: decodedData.pairDirection,
      };
      console.log(proofInput);

      const SnarkJS = window['snarkjs'];
      const { proof, publicSignals } = await SnarkJS.groth16.fullProve(
        proofInput,
        '/withdraw.wasm',
        '/setup_final.zkey',
      );

      const callInputs = [
        proof.pi_a.slice(0, 2).map(BN256ToHex).map(BigInt),
        proof.pi_b
          .slice(0, 2)
          .map((row) => reverseCoordinate(row.map(BN256ToHex))),
        proof.pi_c.slice(0, 2).map(BN256ToHex),
        publicSignals.slice(0, 2).map(BN256ToHex),
      ];

      // console.log(callInputs);
      /* 
      const tx = await getTornado(callInputs, CONTRACT.TOKEN.ADDRESS, address);
      console.log(tx); */

      const userOpHash = await kernelClient.sendUserOperation({
        userOperation: {
          callData: await kernelClient.account!.encodeCallData({
            to: CONTRACT.TORNADO.ADDRESS as `0x${string}`,
            value: BigInt(0),
            data: encodeFunctionData({
              abi: CONTRACT.TORNADO.ABI,
              functionName: 'withdraw',
              args: [
                callInputs[0] as [bigint, bigint],
                callInputs[1] as [[bigint, bigint], [bigint, bigint]],
                callInputs[2] as [bigint, bigint],
                callInputs[3] as [bigint, bigint],
                CONTRACT.TOKEN.ADDRESS as `0x${string}`,
                address,
              ],
            }),
          }),
        },
      });
      const bundlerClient = kernelClient.extend(
        bundlerActions(kernelClient.account!.entryPoint),
      );
      const receipt2 = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });
      console.log(receipt2);

      // const callData = tornadoInterface.encodeFunctionData('withdraw', [42]);

      ///////////////////////////////////////////////////////////////
      /*
      receipt = await window.ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [proofElements.txHash],
      });
      if (!receipt) {
        throw 'empty-receipt';
      }

      const log = receipt.logs[0];
      const decodedData = tornadoInterface.decodeEventLog(
        'Deposit',
        log.data,
        log.topics,
      );
      

      const SnarkJS = window['snarkjs'];

      ethers.TransactionReceipt;
      const proofInput = {
        // root: BNToDecimal(decodedData.root),
        nullifierHash: ballot.nullifierHash,
        // recipient: BNToDecimal(account.address),
        secret: BN256ToBin(ballot.secret).split(''),
        nullifier: BN256ToBin(ballot.nullifier).split(''),
        // hashPairings: decodedData.hashPairings.map((n) => BNToDecimal(n)),
        // hashDirections: decodedData.pairDirection,
      };

      const { proof, publicSignals } = await SnarkJS.groth16.fullProve(
        proofInput,
        '/withdraw.wasm',
        '/setup_final.zkey',
      );

      const callInputs = [
        proof.pi_a.slice(0, 2).map(BN256ToHex),
        proof.pi_b
          .slice(0, 2)
          .map((row) => reverseCoordinate(row.map(BN256ToHex))),
        proof.pi_c.slice(0, 2).map(BN256ToHex),
        publicSignals.slice(0, 2).map(BN256ToHex),
      ];

      console.log(callInputs);

      const callData = tornadoInterface.encodeFunctionData(
        'withdraw',
        callInputs,
      );
      const tx = {
        to: tornadoAddress,
        from: account.address,
        data: callData,
      };
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
      });

      var receipt;
      while (!receipt) {
        receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash],
        });
        await new Promise((resolve, reject) => {
          setTimeout(resolve, 1000);
        });
      }

      if (!!receipt) {
        updateWithdrawalSuccessful(true);
      }
    */
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
