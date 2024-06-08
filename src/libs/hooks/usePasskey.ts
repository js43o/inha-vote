import {
  createPasskeyValidator,
  getPasskeyValidator,
} from '@zerodev/passkey-validator';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { ethers, toBigInt } from 'ethers';
import {
  getKernelClient,
  getPublicClient,
  getSaltOnchain,
} from '~/libs/contract';
import { kernelClientAtomKey } from '~/libs/atom';
import {
  getUser,
  registerAddress,
  registerStudentNumberToOnChain,
} from '~/libs/api';
import { AsyncStatus } from '~/libs/types';

const entryPoint = ENTRYPOINT_ADDRESS_V07;
const { VITE_PASSKEY_SERVER_URL } = import.meta.env;

export function usePassKey() {
  const [registerStatus, setRegisterStatus] = useState<AsyncStatus>('INITIAL');
  const [loginStatus, setLoginStatus] = useState<AsyncStatus>('INITIAL');
  const [kernelClientAtom, setKernelClientAtom] = useAtom(kernelClientAtomKey);

  /*   const test = async () => {
    const data = await getPublicClient().readContract({
      address: VOTING_BOX_ADDRESS,
      abi: VOTING_BOX_CONTRACT_ABI,
      functionName: 'owner',
    });
    console.log('data:', data);
  }; */

  const registerPasskey = async (studentNumber: string) => {
    setRegisterStatus('LOADING');
    try {
      const passkeyValidator = await createPasskeyValidator(getPublicClient(), {
        passkeyName: studentNumber,
        passkeyServerUrl: VITE_PASSKEY_SERVER_URL,
        entryPoint,
      });

      // 계정 및 클라이언트 생성
      const kernelClient = await getKernelClient(passkeyValidator);
      console.log('kernelClient:', kernelClient);
      setKernelClientAtom(kernelClient);

      // 사용자 address를 DB에 등록
      const res1 = await registerAddress(
        studentNumber,
        kernelClient.account.address,
      );

      // 사용자 address를 온체인에 등록
      const res2 = await registerStudentNumberToOnChain(studentNumber);

      console.log(res1, res2);

      // 학번으로 salt 가져오기 (백엔드 API)
      const user = await getUser(studentNumber);
      if (!user) {
        setRegisterStatus('FAILURE');
        console.log('사용자 정보 조회에 실패했습니다.');
        return;
      }

      // 온체인 salt 가져오기
      const saltHashOnChain = await getSaltOnchain(studentNumber);

      console.log("DB's salt:", user.salt);
      console.log("onchain's salt:", saltHashOnChain);
      console.log('toBigInt:', toBigInt(user.salt));

      const saltHash = BigInt(ethers.keccak256(ethers.toUtf8Bytes(user.salt)));
      console.log('DB salt hash:', saltHash);

      // 두 값 비교해서 같은지 검증하기
      if (saltHash !== saltHashOnChain) {
        setRegisterStatus('FAILURE');
        console.log('SALT 값이 일치하지 않습니다.');
        return;
      }

      // TODO: 검증 성공 시 백엔드 투표권 할당 API 호출
      // await ...
      setRegisterStatus('SUCCESS');
    } catch (e) {
      console.log(e);
      setRegisterStatus('FAILURE');
    }
  };

  const loginPasskey = async () => {
    let kernelClient = null;
    setLoginStatus('LOADING');
    try {
      const passkeyValidator = await getPasskeyValidator(getPublicClient(), {
        passkeyServerUrl: VITE_PASSKEY_SERVER_URL,
        entryPoint,
      });
      kernelClient = await getKernelClient(passkeyValidator);
      console.log('kernelClient:', kernelClient);
      setKernelClientAtom(kernelClient);
      setLoginStatus('SUCCESS');
    } catch (e) {
      console.log(e);
      setLoginStatus('FAILURE');
    }

    return kernelClient;
  };

  return {
    registerStatus,
    loginStatus,
    registerPasskey,
    loginPasskey,
  };
}
