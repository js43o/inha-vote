import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Input, Select } from '~/components';
import { RegisterInput } from '~/lib/types';

export function RegisterPage() {
  const [step, setStep] = useState(1);
  const [mobileAuthenticationRequested, setMobileAuthenticationRequested] =
    useState(false);
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    trigger,
  } = useForm<RegisterInput>();

  const onClickNext = async () => {
    const isStepOneValid = await trigger([
      'name',
      'studentNumber',
      'password',
      'passwordConfirm',
    ]);
    if (step === 1 && isStepOneValid) {
      setStep(2);
    }
  };

  const onClickPrev = () => {
    setStep(1);
  };

  const requestMobileAuthentication = async () => {
    const isPhoneNumberValid = await trigger('phoneNumber');

    if (isPhoneNumberValid) {
      setMobileAuthenticationRequested(true);
    }
  };

  const onSubmit: SubmitHandler<RegisterInput> = (data) => {
    if (isValid) {
      console.log('REGISTER:', data);
      // register logics
    }
  };

  return (
    <div className="flex flex-col gap-24 p-4 h-full justify-center items-center">
      <div className="max-w-80 w-full flex flex-col gap-8">
        <div className="flex items-baseline gap-4">
          <h1 className="flex items-center gap-1 font-bold text-3xl">
            계정 등록
          </h1>
          <h2 className="text-xl text-gray-500">
            {step === 1 ? '1. 기본 정보 입력' : '2. 휴대전화 인증'}
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`${step === 1 ? 'flex flex-col gap-4' : 'hidden'}`}>
            <Input
              label="이름"
              maxLength={20}
              {...register('name', {
                required: true,
                maxLength: 20,
                pattern: /^[a-zA-Z가-힣\s]+$/,
              })}
              error={
                errors.name && '이름은 20자 이하의 한글 또는 영문이어야 합니다.'
              }
            />
            <Input
              label="학번"
              maxLength={8}
              {...register('studentNumber', {
                required: true,
                pattern: /\d{8}/,
              })}
              error={errors.studentNumber && '학번은 8자리의 숫자여야 합니다.'}
            />
            <Input
              label="비밀번호"
              type="password"
              maxLength={20}
              {...register('password', {
                required: true,
                maxLength: 20,
              })}
              error={errors.password && '비밀번호는 20자 이하여야 합니다.'}
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
              error={errors.passwordConfirm && '비밀번호가 일치하지 않습니다.'}
            />
            <Button
              text="다음으로"
              onClick={onClickNext}
              className="mt-4"
              type="button"
            />
          </div>
          <div className={`${step === 2 ? 'flex flex-col gap-4' : 'hidden'}`}>
            <Select label="통신사" {...register('carrier')}>
              <option value="skt">SKT</option>
              <option value="kt">KT</option>
              <option value="lg">LG U+</option>
              <option value="skt-mvno">SKT 알뜰폰</option>
              <option value="kt-mvno">KT 알뜰폰</option>
              <option value="lg-mvno">LG U+ 알뜰폰</option>
            </Select>
            <div className="flex gap-2">
              <Input
                label="휴대전화번호 ('-' 없이 입력)"
                maxLength={11}
                {...register('phoneNumber', {
                  required: true,
                  pattern: /\d{11}/,
                })}
                error={
                  errors.phoneNumber && '휴대전화번호는 11자리 숫자여야 합니다.'
                }
                disabled={mobileAuthenticationRequested}
              />
              <Button
                text="인증 요청"
                className="relative top-7 h-[46px]"
                type="button"
                onClick={requestMobileAuthentication}
              />
            </div>
            {mobileAuthenticationRequested && (
              <Input
                label="인증번호 입력"
                maxLength={6}
                {...register('authenticationNumber', {
                  required: true,
                  pattern: /\d{6}/,
                })}
                error={
                  errors.authenticationNumber && '인증번호가 일치하지 않습니다.'
                }
              />
            )}
            <div className="flex gap-2 mt-4">
              <Button
                text="이전으로"
                onClick={onClickPrev}
                fullWidth
                theme="secondary"
                type="button"
              />
              <Button
                text="인증하기"
                onClick={onClickNext}
                fullWidth
                disabled={!mobileAuthenticationRequested}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
