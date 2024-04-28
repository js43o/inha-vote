import { SubmitHandler, useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { Button, Input } from '~/components';
import { LoginInput } from '~/lib/types';

export function LoginPage() {
  const { register, handleSubmit } = useForm<LoginInput>();

  const onLogin: SubmitHandler<LoginInput> = (data) => {
    // 패스키 인증 요청 및
    // 로그인 API 호출
    console.log('LOGIN:', data);
  };

  return (
    <div className="flex flex-col grow gap-24 p-4 justify-center items-center">
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
        <Button text="로그인" fullWidth />
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
