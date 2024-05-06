import { randomHex } from 'web3-utils';
import CryptoJS from 'crypto-js';
import wc from '~/libs/circuit/witness_calculator.js';
import {
  BN256ToBin,
  BN256ToHex,
  getRandomFutureDate,
  reverseCoordinate,
  getFormattedDateString,
} from '~/libs/utils';
import { ONE_DAY_MS, ONE_HOUR_MS } from '~/libs/constants';
import { VotingProof } from '~/libs/types';

const CRYPTO_SECRET = import.meta.env.VITE_CRYPTO_SECRET;

export function useVoting() {
  const preVote = async (voteId: number, startDate: Date) => {
    const secret = BigInt(randomHex(32));
    const nullifier = BigInt(randomHex(32));

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

    /*
    const value = ethers.BigNumber.from('100000000000000000').toHexString();

    const tx = {
      to: tornadoAddress,
      from: account.address,
      value: value,
      data: tornadoInterface.encodeFunctionData('deposit', [commitment]),
    };
    */
    try {
      /*
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
      });
      */

      const votingAvailable =
        startDate < new Date()
          ? getRandomFutureDate(ONE_DAY_MS * 3, ONE_HOUR_MS)
          : startDate;

      const votingProof: VotingProof = {
        nullifierHash: nullifierHash.toString(),
        secret: secret.toString(),
        nullifier: nullifier.toString(),
        commitment: commitment.toString(),
        txHash: '',
        votingAvailable,
      };

      return {
        votingAvailable,
        contents: CryptoJS.AES.encrypt(
          JSON.stringify(votingProof),
          CRYPTO_SECRET,
        ).toString(),
      };
    } catch (e) {
      console.log(e);
    }
  };

  const finalVote = async (proofString: string) => {
    if (!proofString) {
      alert('Please input the proof of deposit string.');
      return;
    }

    try {
      const votingProof: VotingProof = JSON.parse(
        CryptoJS.AES.decrypt(proofString, CRYPTO_SECRET).toString(
          CryptoJS.enc.Utf8,
        ),
        (key, value) => (key === 'votingAvailable' ? new Date(value) : value),
      );

      console.log(votingProof);

      if (new Date(votingProof.votingAvailable) > new Date()) {
        console.log(
          `투표 가능 시각이 아닙니다. (${getFormattedDateString(votingProof.votingAvailable, 'DATE_TIME_KOR')}부터 투표 가능)`,
        );

        return;
      }

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
      */

      const SnarkJS = window['snarkjs'];

      const proofInput = {
        // root: BNToDecimal(decodedData.root),
        nullifierHash: votingProof.nullifierHash,
        // recipient: BNToDecimal(account.address),
        secret: BN256ToBin(votingProof.secret).split(''),
        nullifier: BN256ToBin(votingProof.nullifier).split(''),
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

      /*
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

  return { preVote, finalVote };
}
