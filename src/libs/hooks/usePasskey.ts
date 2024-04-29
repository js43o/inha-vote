import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from '@zerodev/sdk';
import {
  createPasskeyValidator,
  getPasskeyValidator,
} from '@zerodev/passkey-validator';
import { bundlerActions, ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import { useState } from 'react';
import { createPublicClient, http, parseAbi, encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
import { AsyncStatus } from '~/libs/types';

const { VITE_BUNDLER_URL, VITE_PAYMASTER_URL, VITE_PASSKEY_SERVER_URL } =
  import.meta.env;
const CHAIN = sepolia;
const entryPoint = ENTRYPOINT_ADDRESS_V07;

const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863';
const contractABI = parseAbi([
  'function mint(address _to) public',
  'function balanceOf(address owner) external view returns (uint256 balance)',
]);

export function usePassKey() {
  const [accountAddress, setAccountAddress] = useState('');
  // const [isKernelClientReady, setIsKernelClientReady] = useState(false);
  const [registerStatus, setRegisterStatus] = useState<AsyncStatus>('INITIAL');
  const [loginStatus, setLoginStatus] = useState<AsyncStatus>('INITIAL');
  const [userOpStatus, setUserOpStatus] = useState<AsyncStatus>('INITIAL');
  const [userOpHash, setUserOpHash] = useState('');

  // 번들러 URL을 통해 공개 클라이언트 반환
  const getPublicClient = () =>
    createPublicClient({
      transport: http(VITE_BUNDLER_URL),
    });

  // 커널 계정 및 커널 클라이언트 생성 함수
  const createAccountAndClient = async (passkeyValidator: any) => {
    // 패스키 검증자를 받아서 커널 계정을 생성함
    const kernelAccount = await createKernelAccount(getPublicClient(), {
      plugins: {
        sudo: passkeyValidator,
      },
      entryPoint,
    });

    // 그리고 커널 계정으로 다시 커널 계정 클라이언트를 생성함
    // 번들러도 사용됨
    const kernelClient = createKernelAccountClient({
      account: kernelAccount,
      chain: CHAIN,
      bundlerTransport: http(VITE_BUNDLER_URL),
      entryPoint,
      middleware: {
        // 이건 아마 UserOp 시 요금을 면제해주는 기능?
        sponsorUserOperation: async ({ userOperation }) => {
          const zerodevPaymaster = createZeroDevPaymasterClient({
            chain: CHAIN,
            transport: http(VITE_PAYMASTER_URL),
            entryPoint,
          });
          return zerodevPaymaster.sponsorUserOperation({
            userOperation,
            entryPoint,
          });
        },
      },
    });

    // setIsKernelClientReady(true);
    setAccountAddress(kernelAccount.address);

    // localStorage에 커널 계정 및 클라이언트 저장
    localStorage.setItem('kernelAccount', JSON.stringify(kernelAccount));
    localStorage.setItem('kernelClient', JSON.stringify(kernelClient));
  };

  // localStorage에 저장된 커널 계정 및 클라이언트 반환
  const getKernelAccountAndClient = () => {
    const kernelAccountString = localStorage.getItem('kernelAccount');
    const kernelClientString = localStorage.getItem('kernelClient');

    return {
      kernelAccount: kernelAccountString
        ? JSON.parse(kernelAccountString)
        : null,
      kernelClient: kernelClientString ? JSON.parse(kernelClientString) : null,
    };
  };

  // 계정 등록 핸들러
  const registerPasskey = async (username: string) => {
    setRegisterStatus('LOADING');

    try {
      // 회원가입 시 패스키 검증자를 생성하고
      const passkeyValidator = await createPasskeyValidator(getPublicClient(), {
        passkeyName: username,
        passkeyServerUrl: VITE_PASSKEY_SERVER_URL,
        entryPoint,
      });

      // 계정 및 클라이언트 생성
      await createAccountAndClient(passkeyValidator);

      setRegisterStatus('SUCCESS');
    } catch (e) {
      console.log(e);
      setRegisterStatus('FAILURE');
    }
  };

  // 로그인 핸들러
  const loginPasskey = async () => {
    setLoginStatus('LOADING');

    try {
      // 로그인에서는 반대로 만들어둔 패스키 검증자를 가져옴
      const passkeyValidator = await getPasskeyValidator(getPublicClient(), {
        passkeyServerUrl: VITE_PASSKEY_SERVER_URL,
        entryPoint,
      });

      // 똑같이 계정 및 클라이언트 생성
      await createAccountAndClient(passkeyValidator);

      setLoginStatus('SUCCESS');
    } catch (e) {
      console.log(e);
      setLoginStatus('FAILURE');
    }
  };

  // UserOp 전송 핸들러
  const sendUserOp = async () => {
    setUserOpStatus('LOADING');

    const { kernelAccount, kernelClient } = getKernelAccountAndClient();

    if (!kernelAccount || !kernelClient) {
      setUserOpStatus('FAILURE');
      return;
    }

    // 커널 클라이언트를 통해 UserOp를 보내고 그 해시를 받음
    const userOpHash = await kernelClient.sendUserOperation({
      userOperation: {
        // 트랜잭션 내용물을 커널 계정의 메서드를 통해 인코딩함
        callData: await kernelAccount.encodeCallData({
          to: contractAddress,
          value: BigInt(0),
          data: encodeFunctionData({
            abi: contractABI,
            functionName: 'mint',
            // 계정 주소도 넣어줌
            args: [kernelAccount.address],
          }),
        }),
      },
    });

    setUserOpHash(userOpHash);

    // UserOp 응답을 기다렸다가 수신하려면 커널 클라이언트를 번들러 클라이언트로 확장해야 함
    const bundlerClient = kernelClient.extend(bundlerActions(entryPoint));
    await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    /* const userOpMessage = `UserOp completed. <a href="https://jiffyscan.xyz/userOpHash/${userOpHash}?network=mumbai" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700">Click here to view.</a>`;
     */

    setUserOpStatus('SUCCESS');
  };

  return {
    accountAddress,
    // isKernelClientReady,
    registerStatus,
    loginStatus,
    userOpStatus,
    userOpHash,
    registerPasskey,
    loginPasskey,
    sendUserOp,
    getKernelAccountAndClient,
  };
}
