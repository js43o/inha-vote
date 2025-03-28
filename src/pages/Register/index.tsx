import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Progress from '~/assets/icons/progress.svg?react';
import { Button, Input, Modal, Select } from '~/components';
import { usePassKey } from '~/libs/hooks';
import { RegisterInput } from '~/libs/types';
import { ResultModal } from './ResultModal';

export function RegisterPage() {
  const [authenticationRequested, setAuthenticationRequested] = useState(false);
  const [authenticationInput, setAuthenticationInput] = useState('');
  const [authenticationError, setAuthenticationError] = useState(false);
  const [showAuthenticationModal, setShowAuthenticationModal] = useState(false);

  const [showResultModal, setShowResultModal] = useState(false);
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
  } = useForm<RegisterInput>();
  const { registerStatus, registerPasskey } = usePassKey();

  const requestMobileAuthentication = () => {
    if (isValid) {
      // TODO: 인증번호 전송 로직
      setAuthenticationRequested(true);
      setShowAuthenticationModal(true);
    }
  };

  const requestRegistration = async () => {
    // TODO: 인증번호 검증 로직
    if (authenticationInput) {
      await registerPasskey(getValues('studentNumber'));
      setAuthenticationError(false);

      return;
    }

    setAuthenticationError(true);
  };

  useEffect(() => {
    setShowResultModal(
      registerStatus === 'SUCCESS' || registerStatus === 'FAILURE'
        ? true
        : false,
    );
  }, [registerStatus]);

  return (
    <div className="flex flex-col grow gap-24 p-4 justify-center items-center">
      <Modal visible={showAuthenticationModal}>
        <>
          <h1 className="font-bold text-2xl">알림</h1>
          <div>인증번호가 전송되었습니다.</div>
          <Button
            text="확인"
            fullWidth
            onClick={() => setShowAuthenticationModal(false)}
          />
        </>
      </Modal>
      <ResultModal
        visible={showResultModal}
        result={registerStatus}
        onClose={() => setShowResultModal(false)}
      />
      <form
        className="max-w-80 w-full flex flex-col h-full justify-center gap-8"
        onSubmit={handleSubmit(requestMobileAuthentication)}
      >
        <h1 className="flex items-center gap-1 font-bold text-3xl">
          계정 등록
        </h1>
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">안내사항</h2>
          <p>
            이 사이트는 사용자의 보안을 위해 <b>패스키</b>를 사용합니다.{' '}
            <b>오래된 버전</b>의 브라우저 및 OS, <b>블루투스</b>를 지원하지 않는
            기기의 경우 패스키 생성에 제한이 있을 수 있습니다.
          </p>
        </section>
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
              disabled={authenticationRequested}
              grouped
            />
            <Input
              label="학번"
              maxLength={8}
              {...register('studentNumber', {
                required: true,
              })}
              error={!!errors.studentNumber}
              disabled={authenticationRequested}
              grouped
              className="border-none"
            />
          </div>
          <div className="flex flex-col gap-1 text-sm text-danger">
            {errors.name && (
              <p>이름은 20자 이하의 한글 또는 영문이어야 합니다.</p>
            )}
            {errors.studentNumber && <p>학번은 8자리 숫자여야 합니다.</p>}
          </div>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-500">
            2. 휴대전화 인증
          </h2>
          <div className="border border-gray-400 rounded-lg overflow-hidden">
            <Select
              label="통신사"
              {...register('carrier')}
              disabled={authenticationRequested}
              grouped
            >
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
              disabled={authenticationRequested}
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
            className={`${authenticationRequested ? 'flex' : 'hidden'}`}
          />
          <div className="flex flex-col gap-1 text-sm text-danger">
            {errors.phoneNumber && (
              <p>휴대전화번호는 11자리 숫자여야 합니다.</p>
            )}
            {authenticationError && <p>인증번호가 일치하지 않습니다.</p>}
          </div>
        </section>
        <div className="flex items-end h-full">
          {authenticationRequested ? (
            <div className="flex flex-col items-center gap-1 w-full">
              <p className="text-gray-500">
                사용자 계정 및 <b>패스키</b>를 생성합니다.
              </p>
              <Button
                text={registerStatus === 'LOADING' ? '처리 중...' : '계정 등록'}
                onClick={requestRegistration}
                icon={
                  registerStatus === 'LOADING' ? (
                    <Progress
                      width={20}
                      height={20}
                      fill="white"
                      className="animate-spin-fast"
                    />
                  ) : undefined
                }
                fullWidth
                type="button"
                disabled={registerStatus === 'LOADING'}
              />
            </div>
          ) : (
            <Button
              text="인증번호 전송"
              onClick={requestMobileAuthentication}
              fullWidth
            />
          )}
        </div>
      </form>
    </div>
  );
}
