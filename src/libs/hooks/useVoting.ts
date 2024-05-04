import { randomHex } from 'web3-utils';
import wc from '~/libs/circuit/witness_calculator.js';

export function useVoting() {
  const BN256ToBin = (str: string) => {
    let r = BigInt(str).toString(2);
    return `${[...Array(256 - r.length)].map((_) => '0').join('')}${r}`;
  };

  const BN256ToHex = (n: string) => {
    let str = BigInt(n).toString(16);
    str = `0x${str}${[...Array(64 - str.length)].map((_) => '0').join('')}`;
    return str;
  };

  const BNToDecimal = (bn: string) => {
    return BigInt(bn).toString();
  };

  const reverseCoordinate = (p: string[]) => {
    let r = [0, 0];
    r[0] = Number(p[1]);
    r[1] = Number(p[0]);
    return r;
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

    /*
    const value = ethers.BigNumber.from('100000000000000000').toHexString();

    const tx = {
      to: tornadoAddress,
      from: account.address,
      value: value,
      data: tornadoInterface.encodeFunctionData('deposit', [commitment]),
    };

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
      });

      const proofElements = {
        nullifierHash: `${nullifierHash}`,
        secret: secret,
        nullifier: nullifier,
        commitment: `${commitment}`,
        txHash: txHash,
      };

      console.log(proofElements);

      updateProofElements(btoa(JSON.stringify(proofElements)));
    } catch (e) {
      console.log(e);
    }
    */
  };

  const finalVote = async (proofString: string) => {
    if (!proofString) {
      alert('Please input the proof of deposit string.');
      return;
    }

    try {
      const proofElements = JSON.parse(atob(proofString));

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
        nullifierHash: proofElements.nullifierHash,
        // recipient: BNToDecimal(account.address),
        secret: BN256ToBin(proofElements.secret).split(''),
        nullifier: BN256ToBin(proofElements.nullifier).split(''),
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
