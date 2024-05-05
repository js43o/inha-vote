import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Progress from '~/assets/icons/progress.svg?react';
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
  }, [loginStatus]);

  return (
    <div className="flex flex-col grow p-4 justify-center items-center">
      <LoginFailureModal
        visible={showResultModal}
        result={loginStatus}
        onClose={() => setShowResultModal(false)}
      />
      <form
        className="max-w-64 w-full flex flex-col h-full justify-center gap-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="flex justify-center gap-1 font-bold text-4xl">
          INHA_VOTE
        </h1>
        <Button
          text={loginStatus === 'LOADING' ? '처리 중...' : '패스키로 로그인'}
          icon={
            loginStatus === 'LOADING' && (
              <Progress
                width={20}
                height={20}
                fill="white"
                className="animate-spin-fast"
              />
            )
          }
          onClick={loginPasskey}
          disabled={loginStatus === 'LOADING'}
        />
      </form>
      <div className="flex gap-2 items-center">
        <p className="text-gray-500">아직 계정이 없나요?</p>
        <NavLink to="/register">
          <Button text="계정 등록" theme="secondary" size="medium" />
        </NavLink>
      </div>
    </div>
  );
}
