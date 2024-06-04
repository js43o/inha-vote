import { KernelAccountClient } from '@zerodev/sdk';
import { bundlerActions } from 'permissionless';
import { ENTRYPOINT_ADDRESS_V07_TYPE } from 'permissionless/types';

export async function sendTransaction(
  kernelClient: KernelAccountClient<ENTRYPOINT_ADDRESS_V07_TYPE>,
  to: `0x${string}`,
  data: `0x${string}`,
) {
  if (!kernelClient || !kernelClient.account) {
    throw new Error('올바르지 않은 커널 계정 인자');
  }

  const userOpHash = await kernelClient.sendUserOperation({
    userOperation: {
      callData: await kernelClient.account.encodeCallData({
        to,
        value: BigInt(0),
        data,
      }),
    },
  });
  const bundlerClient = kernelClient.extend(
    bundlerActions(kernelClient.account.entryPoint),
  );
  const receipt = await bundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  return receipt.success;
}
