import {
  KernelValidator,
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from '@zerodev/sdk';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import { createPublicClient, http } from 'viem';
import { polygonAmoy } from 'viem/chains';

const CHAIN = polygonAmoy;
const entryPoint = ENTRYPOINT_ADDRESS_V07;
const { VITE_BUNDLER_URL, VITE_PAYMASTER_URL } = import.meta.env;

export function getPublicClient() {
  return createPublicClient({
    chain: CHAIN,
    transport: http(VITE_BUNDLER_URL),
  });
}

export async function getKernelClient(
  passkeyValidator: KernelValidator<typeof entryPoint, string>,
) {
  const kernelAccount = await createKernelAccount(getPublicClient(), {
    plugins: {
      sudo: passkeyValidator,
    },
    entryPoint,
  });
  const kernelClient = createKernelAccountClient({
    account: kernelAccount,
    chain: CHAIN,
    bundlerTransport: http(VITE_BUNDLER_URL),
    entryPoint,
    middleware: {
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

  return kernelClient;
}
