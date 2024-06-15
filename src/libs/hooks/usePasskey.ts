import {
  createPasskeyValidator,
  getPasskeyValidator,
} from '@zerodev/passkey-validator';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import { useState } from 'react';
import { useSetAtom } from 'jotai';
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
  const setKernelClientAtom = useSetAtom(kernelClientAtomKey);

  const registerPasskey = async (studentNumber: string) => {
    setRegisterStatus('LOADING');
    try {
      console.log('##### Register #####');
      const passkeyValidator = await createPasskeyValidator(getPublicClient(), {
        passkeyName: studentNumber,
        passkeyServerUrl: VITE_PASSKEY_SERVER_URL,
        entryPoint,
      });

      console.log('1. 사용자 kernelClient 생성');
      const kernelClient = await getKernelClient(passkeyValidator);
      setKernelClientAtom(kernelClient);
      console.log(
        `kernelClient 생성 성공, address = ${kernelClient.account.address.slice(0, 8)}...`,
      );

      console.log('2. 사용자 address를 DB 및 온체인에 등록');
      const res1 = await registerAddress(
        studentNumber,
        kernelClient.account.address,
      );
      console.log(
        res1 === 200 || res1 === 201 ? 'DB 등록 성공' : 'DB 등록 실패',
      );
      const res2 = await registerStudentNumberToOnChain(studentNumber);
      console.log(
        res2 === 200 || res2 === 201 ? '온체인 등록 성공' : '온체인 등록 실패',
      );

      console.log('3. 사용자의 DB salt와 온체인 salt를 비교');
      const user = await getUser(studentNumber);
      if (!user) {
        setRegisterStatus('FAILURE');
        console.log('사용자 정보 조회에 실패했습니다.');
        return;
      }
      const saltHash = BigInt(ethers.keccak256(ethers.toUtf8Bytes(user.salt)));
      const saltHashOnChain = await getSaltOnchain(studentNumber);
      console.log(`DB salt = ${saltHash}, 온체인 salt = ${saltHashOnChain}`);
      if (saltHash !== saltHashOnChain) {
        setRegisterStatus('FAILURE');
        console.log('salt 값이 일치하지 않습니다.');
        return;
      }
      console.log('salt 값 일치 확인, 계정 등록 성공');
      setRegisterStatus('SUCCESS');
    } catch (e) {
      console.log(e);
      setRegisterStatus('FAILURE');
    }
  };

  const loginPasskey = async () => {
    console.log('##### Login #####');
    let kernelClient = null;
    setLoginStatus('LOADING');
    try {
      const passkeyValidator = await getPasskeyValidator(getPublicClient(), {
        passkeyServerUrl: VITE_PASSKEY_SERVER_URL,
        entryPoint,
      });
      kernelClient = await getKernelClient(passkeyValidator);
      console.log(
        `kernelClent 생성 성공, address = ${kernelClient.account.address.slice(0, 8)}...`,
      );
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
