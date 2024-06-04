import { KernelAccountClient } from '@zerodev/sdk';
import { atom } from 'jotai';
import { ENTRYPOINT_ADDRESS_V07_TYPE } from 'permissionless/types';

export const kernelClientAtomKey =
  atom<KernelAccountClient<ENTRYPOINT_ADDRESS_V07_TYPE> | null>(null);
