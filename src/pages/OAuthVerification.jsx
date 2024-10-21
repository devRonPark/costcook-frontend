import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthApi from '../services/auth.api';
import { useAuth } from '../context/Auth/AuthContext';
import EmailVerification from '../components/EmailVerification';
import VerificationCodeInput from '../components/VerificationCodeInput ';
import Layout from '../components/layout/Layout';

const OAuthVerification = () => {
  const { provider } = useParams();
  const code = new URLSearchParams(window.location.search).get('code');
  const { state, dispatch } = useAuth(); // state와 dispatch 가져오기
  const [loading, setLoading] = useState(true); // API 요청 상태 관리
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 랜덤 숫자 생성
  };

  const handleSendVerificationEmail = (email) => {
    const randCode = generateRandomCode(); // 랜덤 코드 생성
    setGeneratedCode(randCode); // 코드 상태에 저장
    setEmailSent(true); // 이메일 발송 완료 상태 변경
    console.log(`인증 코드 ${randCode}가 ${email}로 발송되었습니다.`); // 로그에 코드 출력
    toast.success(`인증 코드 ${code}가 ${email}로 발송되었습니다.`); // 성공 메시지
  };

  const handleVerifyCode = (inputCode) => {
    if (inputCode === generatedCode) {
      toast.success('인증 코드가 확인되었습니다. 회원가입이 완료되었습니다.'); // 인증 완료 메시지
      setTimeout(async () => {
        dispatch({
          type: 'LOGIN',
          payload: {
            email: state.user.email,
            provider: provider.toLowerCase(),
          },
        });
        toast.info('로그인 중입니다...'); // 로그인 중 메시지
        // 로그인 성공 후 홈으로 이동
        window.location.href = '/home';
      }, 2000);
    } else {
      toast.error('인증 코드가 올바르지 않습니다. 다시 시도해 주세요.'); // 오류 메시지
    }
  };

  const signUpOrLogin = async () => {
    try {
      // 1. Provider 로부터 사용자 정보({key, email, name, provider}) 추출한다.
      // 추출된 사용자 정보에서 provider가 "kakao"일 때 email이 null인 경우에만 ableToLogin: false
      const res = await AuthApi.getProviderInfo(provider, code);

      // res.data.ableToLogin 이 true 이면, 이메일 인증 과정을 거치지 않고 자동 회원가입 처리 및 로그인 요청을 보낸다.
      if (res.ableToLogin) {
        const loginRes = await AuthApi.signUpOrLogin({
          ...res,
          provider: res.provider.toLowerCase(),
        });

        // 로그인 성공하면 전역 상태에 로그인된 사용자 정보를 저장
        dispatch({
          type: 'LOGIN',
          payload: loginRes.data,
        });

        // 로그인 성공 후 홈으로 리다이렉트
        window.location.href = '/home';
      } else {
        // ableToLogin이 false인 경우 전역 상태에 사용자 정보 저장
        dispatch({
          type: 'SET_AUTH_DATA',
          payload: res, // 이메일 인증 절차를 위해 필요한 데이터 저장
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // API 요청이 완료되면 로딩 상태 해제
    }
  };

  useEffect(() => {
    signUpOrLogin();
  }, []);

  // 로딩 중인 경우
  if (loading) {
    return <h1>{provider} 로그인 진행 중...</h1>;
  }

  // 이메일 인증이 필요한 경우 이메일 인증 폼을 렌더링
  if (state.user && !state.user.ableToLogin) {
    const onBackHandler = () => {
      window.history.back();
    };
    return (
      <Layout isBackBtnExist pageName="이메일 인증">
        {!emailSent ? (
          <EmailVerification onSend={handleSendVerificationEmail} />
        ) : (
          <VerificationCodeInput onVerify={handleVerifyCode} />
        )}
      </Layout>
    );
  }

  return null;
};

export default OAuthVerification;
