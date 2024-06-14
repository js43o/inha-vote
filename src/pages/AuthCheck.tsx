import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kernelClientAtomKey } from '~/libs/atom';

export function AuthCheck() {
  const [kernelClientAtom, setKernelClientAtom] = useAtom(kernelClientAtomKey);
  const navigate = useNavigate();

  useEffect(() => {
    if (!kernelClientAtom) {
      return navigate('/login');
    }

    return navigate('/votes/current');
  });

  return <></>;
}
