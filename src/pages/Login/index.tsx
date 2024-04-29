import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { Button, Input } from '~/components';
import { LoginInput } from '~/lib/types';
import { usePassKey } from '~/lib/usePasskey';
import { LoginFailureModal } from './LoginFailureModal';
import Progress from '~/assets/icons/progress.svg?react';

export function LoginPage() {
  const { register, handleSubmit } = useForm<LoginInput>();
  const [showResultModal, setShowResultModal] = useState(false);
  const { loginStatus, loginPasskey } = usePassKey();
  const navigate = useNavigate();

  const onLogin: SubmitHandler<LoginInput> = async (data) => {
    // 패스키 인증 요청
    await loginPasskey();

    // 로그인 API 호출
    console.log('LOGIN:', data);
    if (loginStatus === 'SUCCESS') {
      navigate('/votes/current');
    }
  };

  useEffect(() => {
    if (loginStatus === 'SUCCESS') {
      return navigate('/votes/current');
    }

    setShowResultModal(loginStatus === 'FAILURE' ? true : false);
  }, [loginStatus]);

  return (
    <div className="flex flex-col grow gap-24 p-4 justify-center items-center">
      <LoginFailureModal
        visible={showResultModal}
        result={loginStatus}
        onClose={() => setShowResultModal(false)}
      />
      <form
        className="max-w-80 w-full flex flex-col h-full justify-center gap-8"
        onSubmit={handleSubmit(onLogin)}
      >
        <h1 className="flex justify-center gap-1 font-bold text-4xl">
          INHA_VOTE
        </h1>
        <div className="border border-gray-400 rounded-lg overflow-hidden group">
          <Input
            label="학번"
            maxLength={8}
            {...register('studentNumber', {
              required: true,
              pattern: /\d{8}/,
            })}
            grouped
          />
          <Input
            label="비밀번호"
            type="password"
            maxLength={20}
            {...register('password', {
              required: true,
              maxLength: 20,
            })}
            grouped
            className="border-none"
          />
        </div>
        <Button
          text={loginStatus === 'LOADING' ? '처리 중...' : '로그인'}
          icon={
            loginStatus === 'LOADING' ? (
              <Progress
                width={20}
                height={20}
                fill="white"
                className="animate-spin-fast"
              />
            ) : undefined
          }
          fullWidth
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
