import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Input } from '~/components';
import { RegisterInput } from '~/lib/types';

export function RegisterPage() {
  const [step, setStep] = useState(1);
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
  } = useForm<RegisterInput>();

  const onClickNext = () => {
    if (step === 1 && isValid) {
      setStep(2);
    }
  };

  const onSubmit: SubmitHandler<RegisterInput> = (data) => console.log(data);

  return (
    <div className="flex flex-col gap-24 p-4 h-full justify-center items-center">
      <div className="max-w-80 w-full flex flex-col gap-8">
        <div className="flex items-baseline gap-4">
          <h1 className="flex items-center gap-1 font-bold text-3xl">
            계정 등록
          </h1>
          <h2 className="text-xl font-semibold text-gray-500">
            기본 정보 입력
          </h2>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {step === 1 ? (
            <>
              <Input
                label="이름"
                maxLength={20}
                {...register('name', {
                  required: true,
                  maxLength: 20,
                  pattern: /^[a-zA-Z가-힣\s]+$/,
                })}
                error={
                  errors.name &&
                  '이름은 20자 이하의 한글 또는 영문이어야 합니다.'
                }
              />
              <Input
                label="학번"
                maxLength={8}
                {...register('studentNumber', {
                  required: true,
                  pattern: /\d{8}/,
                })}
                error={
                  errors.studentNumber && '학번은 8자리의 숫자여야 합니다.'
                }
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
                error={
                  errors.passwordConfirm && '비밀번호가 일치하지 않습니다.'
                }
              />
              <Button text="다음" onClick={onClickNext} className="mt-4" />
            </>
          ) : step === 2 ? (
            <></>
          ) : (
            <></>
          )}
        </form>
      </div>
    </div>
  );
}
