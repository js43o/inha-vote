import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Progress from '~/assets/icons/progress.svg?react';
import Key from '~/assets/icons/key.svg?react';
import { Button } from '~/components';
import { usePassKey } from '~/libs/hooks';
import { LoginFailureModal } from './LoginFailureModal';

export function LoginPage() {
  const [showResultModal, setShowResultModal] = useState(false);
  const { loginStatus, loginPasskey } = usePassKey();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginStatus === 'SUCCESS') {
      return navigate('/votes/current');
    }

    setShowResultModal(loginStatus === 'FAILURE' ? true : false);
  }, [loginStatus, navigate]);

  return (
    <div className="flex flex-col justify-center gap-4 items-center grow bg-login bg-cover bg-center">
      <main className="flex flex-col p-8 justify-center items-center bg-white rounded-xl shadow-xl">
        <LoginFailureModal
          visible={showResultModal}
          result={loginStatus}
          onClose={() => setShowResultModal(false)}
        />
        <form
          className="max-w-64 w-full flex flex-col h-full justify-center gap-8"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-2">
            <h1 className="flex justify-center gap-1 text-4xl font-light">
              INHA VOTE
            </h1>
            <p>인하대학교 블록체인 선거 투표 플랫폼</p>
          </div>
          <Button
            text={loginStatus === 'LOADING' ? '처리 중...' : '패스키로 로그인'}
            icon={
              loginStatus === 'LOADING' ? (
                <Progress
                  width={20}
                  height={20}
                  fill="white"
                  className="animate-spin-fast"
                />
              ) : (
                <Key width={20} height={20} fill="white" />
              )
            }
            onClick={loginPasskey}
            disabled={loginStatus === 'LOADING'}
          />
        </form>
      </main>
      <div className="flex gap-2 items-center">
        <p className="text-gray-300">아직 계정이 없나요?</p>
        <NavLink
          to="/register"
          className="border border-white py-1.5 px-2 rounded-md text-white hover:bg-[#ffffff10] active:bg-[#00000010] font-bold"
        >
          계정 등록
        </NavLink>
      </div>
    </div>
  );
}
