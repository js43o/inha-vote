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
import { useEffect, useState } from 'react';
import { createPublicClient, http, parseAbi, encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';

// @dev add your BUNDLER_URL, PAYMASTER_URL, and PASSKEY_SERVER_URL here
const { VITE_BUNDLER_URL, VITE_PAYMASTER_URL, VITE_PASSKEY_SERVER_URL } =
  import.meta.env;
const CHAIN = sepolia;
const entryPoint = ENTRYPOINT_ADDRESS_V07;

const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863';
const contractABI = parseAbi([
  'function mint(address _to) public',
  'function balanceOf(address owner) external view returns (uint256 balance)',
]);

// 번들러를 통해 공개 클라이언트 생성
const publicClient = createPublicClient({
  transport: http(VITE_BUNDLER_URL),
});

let kernelAccount: any;
let kernelClient: any;

export function TestPage() {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [accountAddress, setAccountAddress] = useState('');
  const [isKernelClientReady, setIsKernelClientReady] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingUserOp, setIsSendingUserOp] = useState(false);
  const [userOpHash, setUserOpHash] = useState('');
  const [userOpStatus, setUserOpStatus] = useState('');

  // 계정 및 클라이언트 생성 함수
  const createAccountAndClient = async (passkeyValidator: any) => {
    // 패스키 검증자를 받아서 커널 계정을 생성함
    kernelAccount = await createKernelAccount(publicClient, {
      plugins: {
        sudo: passkeyValidator,
      },
      entryPoint,
    });

    // 그리고 커널 계정으로 다시 커널 계정 클라이언트를 생성함
    // 번들러도 사용됨
    kernelClient = createKernelAccountClient({
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

    setIsKernelClientReady(true);
    setAccountAddress(kernelAccount.address);
  };

  // 계정 등록 핸들러
  const handleRegister = async () => {
    setIsRegistering(true);

    // 회원가입 시 패스키 검증자를 생성하고
    const passkeyValidator = await createPasskeyValidator(publicClient, {
      passkeyName: username,
      passkeyServerUrl: VITE_PASSKEY_SERVER_URL,
      entryPoint,
    });

    // 계정 및 클라이언트 생성
    await createAccountAndClient(passkeyValidator);

    setIsRegistering(false);
    window.alert('Register done.  Try sending UserOps.');
  };

  // 로그인 핸들러
  const handleLogin = async () => {
    setIsLoggingIn(true);

    // 로그인에서는 반대로 만들어둔 패스키 검증자를 가져옴
    const passkeyValidator = await getPasskeyValidator(publicClient, {
      passkeyServerUrl: VITE_PASSKEY_SERVER_URL,
      entryPoint,
    });

    // 똑같이 계정 및 클라이언트 생성
    await createAccountAndClient(passkeyValidator);

    setIsLoggingIn(false);
    window.alert('Login done.  Try sending UserOps.');
  };

  // UserOp 전송 핸들러
  const handleSendUserOp = async () => {
    setIsSendingUserOp(true);
    setUserOpStatus('Sending UserOp...');

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

    // Update the message based on the count of UserOps
    const userOpMessage = `UserOp completed. <a href="https://jiffyscan.xyz/userOpHash/${userOpHash}?network=mumbai" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700">Click here to view.</a>`;

    setUserOpStatus(userOpMessage);
    setIsSendingUserOp(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  // Spinner component for visual feedback during loading states
  const Spinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-24">
      <div className="w-full max-w-lg mx-auto">
        <h1 className="text-4xl font-semibold text-center mb-12">
          ZeroDev Passkeys Tutorial
        </h1>

        <div className="space-y-4">
          {/* Account Address Label */}
          {accountAddress && (
            <div className="text-center mb-4">
              Account address:{' '}
              <a
                href={`https://jiffyscan.xyz/account/${accountAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                {' '}
                {accountAddress}{' '}
              </a>
            </div>
          )}

          {/* Input Box */}
          <input
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 text-black border border-gray-300 rounded-lg w-full"
          />

          {/* Register and Login Buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={isRegistering || isLoggingIn}
              className="flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full"
            >
              {isRegistering ? <Spinner /> : 'Register'}
            </button>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoggingIn || isRegistering}
              className="mt-2 sm:mt-0 flex justify-center items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 w-full"
            >
              {isLoggingIn ? <Spinner /> : 'Login'}
            </button>
          </div>

          {/* Send UserOp Button */}
          <div className="flex flex-col items-center w-full">
            <button
              onClick={handleSendUserOp}
              disabled={!isKernelClientReady || isSendingUserOp}
              className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 flex justify-center items-center w-full ${
                isKernelClientReady && !isSendingUserOp
                  ? 'bg-green-500 hover:bg-green-700 focus:ring-green-500'
                  : 'bg-gray-500'
              }`}
            >
              {isSendingUserOp ? <Spinner /> : 'Send UserOp'}
            </button>
            {/* UserOp Status Label */}
            {userOpHash && (
              <div
                className="mt-4"
                dangerouslySetInnerHTML={{ __html: userOpStatus }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
