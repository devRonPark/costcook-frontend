import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthApi from '../services/auth.api';
import { useAuth } from '../context/Auth/AuthContext';
import EmailVerification from '../components/EmailVerification';
import VerificationCodeInput from '../components/VerificationCodeInput ';
import Layout from '../components/layout/Layout';
import LoadingComponent from '../components/common/LoadingComponent';

const OAuthVerification = () => {
  const { provider } = useParams();
  const code = new URLSearchParams(window.location.search).get('code');
  const { state, dispatch } = useAuth(); // state와 dispatch 가져오기
  const [loading, setLoading] = useState(true); // API 요청 상태 관리
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  // 인증번호 발송 API 호출
  const handleSendVerificationEmail = async (inputVal) => {
    try {
      // AuthApi 객체의 이메일 발송 함수 호출
      const response = await AuthApi.sendVerificationEmail({
        email: inputVal,
      });

      // 응답 처리
      const { data, status } = response; // Axios를 사용할 경우 response.data에서 응답 데이터 추출

      // 사용자 이메일 상태 업데이트 (이메일 발송 성공 시)
      if (status === 200) {
        // dispatch를 이용하여 사용자 이메일 상태 업데이트
        dispatch({
          type: 'UPDATE_EMAIL', // 이메일 업데이트를 위한 액션 타입
          payload: inputVal, // 새로운 이메일 값
        });

        setEmailSent(true); // 이메일 발송 성공 시 상태 변경
        toast.success(`인증 코드가 ${inputVal}로 발송되었습니다.`); // 성공 메시지 표시
      } else {
        toast.error('이메일 발송에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 발송 오류:', error);
      toast.error('이메일 발송에 실패했습니다. 다시 시도해주세요.'); // 오류 메시지 표시
    }
  };

  // 인증번호 확인 API 호출
  const handleVerifyCode = async (inputCode) => {
    try {
      const response = await AuthApi.verifyCode({
        email: state.user.data.email, // 사용자 이메일
        verificationCode: inputCode, // 입력한 인증 코드
      });

      // 응답 처리
      const { data, status } = response; // Axios를 사용할 경우 response.data에서 응답 데이터 추출

      if (status === 200) {
        // 인증 코드가 확인되었을 경우
        if (data.verified) {
          // 성공 메시지 표시
          toast.success(
            '인증 코드가 확인되었습니다. 회원가입이 완료되었습니다.'
          );

          // 로그인 요청을 위한 사용자 정보 설정
          const loginData = {
            ...state.user.data,
            provider: state.user.data.provider.toLowerCase(),
          };

          // 로그인 요청
          const loginRes = await AuthApi.signUpOrLogin(loginData);

          // 로그인 성공 시 전역 상태에 로그인된 사용자 정보를 저장
          dispatch({
            type: 'LOGIN',
            payload: loginRes.data,
          });

          toast.info('로그인 중입니다...'); // 로그인 중 메시지

          navigate('/home');
          // 로그인 중 메시지 표시 후 500ms 대기 (필요에 따라 조정 가능)
          setTimeout(() => {
            // window.location.href = '/home';
          }, 500); // 500ms 대기 후 홈으로 이동
        } else {
          // 인증 코드가 일치하지 않는 경우
          toast.error('인증 코드가 올바르지 않습니다. 다시 시도해 주세요.'); // 오류 메시지
        }
      } else {
        // API 호출이 실패한 경우
        toast.error(data.message || '인증 코드 확인 중 오류가 발생했습니다.'); // 오류 메시지
      }
    } catch (error) {
      // 네트워크 오류 또는 예외 처리
      toast.error('인증 코드 확인 중 오류가 발생했습니다.'); // 일반 오류 메시지
      console.error('Verification error:', error); // 콘솔에 오류 로그
    }
  };

  // 사용자 정보 추출 -> 로그인 가능하면 로그인 즉시 처리
  const confirmUserLogin = async () => {
    try {
      // 1. Provider 로부터 사용자 정보({key, email, name, provider}) 추출한다.
      // 추출된 사용자 정보에서 provider가 "kakao"일 때 email이 null인 경우에만 ableToLogin: false
      const res = await AuthApi.getProviderInfo(provider, code);

      // res.data.ableToLogin 이 true 이면, 이메일 인증 과정을 거치지 않고 자동 회원가입 처리 및 로그인 요청을 보낸다.
      console.log(res.data);
      if (res.data.ableToLogin) {
        const loginRes = await AuthApi.signUpOrLogin({
          ...res.data,
          provider: res.data.provider.toLowerCase(),
        });

        // 로그인 성공하면 전역 상태에 로그인된 사용자 정보를 저장
        dispatch({
          type: 'LOGIN',
          payload: loginRes.data,
        });

        toast.info('로그인 중입니다...'); // 로그인 중 메시지

        navigate('/home');
        // 로그인 중 메시지 표시 후 500ms 대기 (필요에 따라 조정 가능)
        // setTimeout(() => {
        // }, 500); // 500ms 대기 후 홈으로 이동

        // 로그인 성공 후 홈으로 리다이렉트
        // window.location.href = '/home';
      } else {
        // ableToLogin이 false인 경우 전역 상태에 사용자 정보 저장
        dispatch({
          type: 'SET_AUTH_DATA',
          payload: res, // 이메일 인증 절차를 위해 필요한 데이터 저장
        });

        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      // TODO: 에러 발생 시 어느 페이지로 이동 시킬 지 결정 후 구현.
    }
  };

  useEffect(() => {
    confirmUserLogin();
  }, []);

  // 로딩 중인 경우
  if (loading) {
    return (
      <LoadingComponent
        loading={loading}
        loadingText={`${provider} 인증 중입니다...`}
      />
    );
  }
  return (
    <Layout isBackBtnExist pageName="이메일 인증">
      {!emailSent ? (
        <EmailVerification onSend={handleSendVerificationEmail} />
      ) : (
        <VerificationCodeInput
          onVerify={handleVerifyCode}
          onResend={handleSendVerificationEmail}
        />
      )}
    </Layout>
  );
};

export default OAuthVerification;
