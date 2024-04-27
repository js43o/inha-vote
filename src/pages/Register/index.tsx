import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Select } from '~/components';
import { RegisterInput } from '~/lib/types';

export function RegisterPage() {
  const [mobileAuthenticationRequested, setMobileAuthenticationRequested] =
    useState(false);
  const [authenticationInput, setAuthenticationInput] = useState('');
  const [authenticationError, setAuthenticationError] = useState(false);
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
  } = useForm<RegisterInput>();

  const requestRegistration = async () => {
    if (authenticationInput === '123123') {
      // 계정 등록 API 호출
      console.log('REGISTER:', getValues());
      setAuthenticationError(false);

      return;
    }

    setAuthenticationError(true);
  };

  const requestMobileAuthentication = () => {
    if (isValid) {
      // 인증번호 전송 로직
      setMobileAuthenticationRequested(true);
    }
  };

  console.log(errors);

  return (
    <div className="flex flex-col gap-24 p-4 h-full justify-center items-center">
      <form
        className="max-w-80 w-full flex flex-col h-full justify-center gap-8"
        onSubmit={handleSubmit(requestMobileAuthentication)}
      >
        <h1 className="flex items-center gap-1 font-bold text-3xl">
          계정 등록
        </h1>
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-500">
            1. 기본 정보 입력
          </h2>
          <div className="border border-gray-400 rounded-lg overflow-hidden group">
            <Input
              label="이름"
              maxLength={20}
              {...register('name', {
                required: true,
                maxLength: 20,
                pattern: /^[a-zA-Z가-힣\s]+$/,
              })}
              error={!!errors.name}
              grouped
            />
            <Input
              label="학번"
              maxLength={8}
              {...register('studentNumber', {
                required: true,
                pattern: /\d{8}/,
              })}
              error={!!errors.studentNumber}
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
              error={!!errors.password}
              grouped
            />
            <Input
              label="비밀번호 확인"
              type="password"
              maxLength={20}
              {...register('passwordConfirm', {
                required: true,
                maxLength: 20,
                validate: (value) => value === getValues('password'),
              })}
              error={!!errors.passwordConfirm}
              grouped
              className="border-none"
            />
          </div>
          <div className="flex flex-col gap-1 text-sm text-red-500">
            <p>
              {errors.name && '이름은 20자 이하의 한글 또는 영문이어야 합니다.'}
            </p>
            <p>{errors.studentNumber && '학번은 8자리 숫자여야 합니다.'}</p>
            <p>{errors.password && '비밀번호는 20자리 이하여야 합니다.'}</p>
            <p>{errors.passwordConfirm && '비밀번호가 일치하지 않습니다.'}</p>
          </div>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-500">
            2. 휴대전화 인증
          </h2>
          <div className="border border-gray-400 rounded-lg overflow-hidden">
            <Select label="통신사" {...register('carrier')} grouped>
              <option value="skt">SKT</option>
              <option value="kt">KT</option>
              <option value="lg">LG U+</option>
              <option value="skt-mvno">SKT 알뜰폰</option>
              <option value="kt-mvno">KT 알뜰폰</option>
              <option value="lg-mvno">LG U+ 알뜰폰</option>
            </Select>
            <Input
              label="휴대전화번호 ('-' 없이 입력)"
              maxLength={11}
              {...register('phoneNumber', {
                required: true,
                pattern: /\d{11}/,
              })}
              error={!!errors.phoneNumber}
              disabled={mobileAuthenticationRequested}
              grouped
              className="border-none"
            />
          </div>
          <Input
            label="인증번호 입력"
            maxLength={6}
            value={authenticationInput}
            onChange={(e) => setAuthenticationInput(e.target?.value)}
            name="authenticationNumber"
            error={!!authenticationError}
            className={`${mobileAuthenticationRequested ? 'flex' : 'hidden'}`}
          />
          <div className="flex flex-col gap-1 text-sm text-red-500">
            <p>
              {errors.phoneNumber && '휴대전화번호는 11자리 숫자여야 합니다.'}
            </p>
            <p>{authenticationError && '인증번호가 일치하지 않습니다.'}</p>
          </div>
        </section>
        <div className="flex items-end h-full ">
          {mobileAuthenticationRequested ? (
            <Button
              text="가입하기"
              onClick={requestRegistration}
              fullWidth
              type="button"
            />
          ) : (
            <Button
              text="인증하기"
              onClick={requestMobileAuthentication}
              fullWidth
            />
          )}
        </div>
      </form>
    </div>
  );
}
