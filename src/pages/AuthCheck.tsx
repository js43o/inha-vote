import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kernelClientAtomKey } from '~/libs/atom';

export function AuthCheck() {
  const kernelClientAtom = useAtomValue(kernelClientAtomKey);
  const navigate = useNavigate();

  useEffect(() => {
    if (!kernelClientAtom) {
      return navigate('/login');
    }

    return navigate('/votes/current');
  });

  return <></>;
}
