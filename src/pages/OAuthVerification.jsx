import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthApi from '../services/auth.api';
import { useAuth } from '../context/Auth/AuthContext';
import EmailVerification from '../components/EmailVerification';
import VerificationCodeInput from '../components/VerificationCodeInput ';
import Layout from '../components/layout/Layout';
import LoadingComponent from '../components/common/LoadingComponent';
import {
  clearFavoriteRecipeIds,
  getFavoriteRecipeIds,
  getRecommendedRecipes,
  getWeeklyBudget,
} from '../utils/sessionStorageUtil';

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

          // sessionStorage에서 favoriteRecipeIds 값을 가져옵니다.
          const favoriteRecipeIds = getFavoriteRecipeIds();

          // sessionStorage에서 budget 값을 가져옵니다.
          const budget = getWeeklyBudget();

          // sessionStorage에서 recommendedRecipes 값을 가져옵니다.
          // { year, weekNumber, recipes: [{id}, ...]}
          const recommendedRecipes = getRecommendedRecipes();
          // recommendedRecipes가 null이 아닌 경우에만 추천 레시피 목록을 추가
          const recommendedRecipePayload = recommendedRecipes
            ? recommendedRecipes.recipes.map((r) => ({
                year: recommendedRecipes.year,
                weekNumber: recommendedRecipes.weekNumber,
                recipeId: r.id,
                isUsed: r.isUsed,
              }))
            : [];

          // 로그인 요청을 위한 사용자 정보 설정
          const loginData = {
            ...state.user.data,
            provider: state.user.data.provider.toLowerCase(),
            // favoriteRecipeIds가 존재하고, 빈 배열이 아닌 경우에만 loginData에 추가.
            ...(favoriteRecipeIds && favoriteRecipeIds.length > 0
              ? { favoriteRecipeIds }
              : {}),
            // budget 이 존재하고, null 이 아닌 경우에만 loginData 에 추가.
            ...(budget != null
              ? {
                  year: budget.year,
                  weekNumber: budget.weekNumber,
                  weeklyBudget: budget.amount,
                }
              : {}),
            // recommendedRecipePayload가 비어있지 않으면 loginData에 추가.
            ...(recommendedRecipePayload.length > 0
              ? { recommendedRecipes: recommendedRecipePayload }
              : {}),
          };

          // 로그인 요청
          const loginRes = await AuthApi.signUpOrLogin(loginData);

          if (loginRes.status === 200) {
            clearFavoriteRecipeIds();
            // 로그인 성공 시 전역 상태에 로그인된 사용자 정보를 저장
            dispatch({
              type: 'LOGIN',
              payload: loginRes.data,
            });

            toast.info('로그인 중입니다...'); // 로그인 중 메시지

            // 사용자 프로필 정보 조회해서 이 데이터가 있냐 없냐에 따라서 어느 페이지로 이동시킬지가 결정되잖아요.
            if (loginRes.data.userProfileUpdated) {
              // 홈 화면 이동
              navigate('/home');
            } else {
              // 프로필 업데이트 페이지로 이동
              navigate('/profile/update');
            }
          }
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
      if (res.data.ableToLogin) {
        // sessionStorage에서 favoriteRecipeIds 값을 가져옵니다.
        const favoriteRecipeIds = getFavoriteRecipeIds();
        // sessionStorage에서 budget 값을 가져옵니다.
        const budget = getWeeklyBudget();
        // sessionStorage에서 recommendedRecipes 값을 가져옵니다.
        // { year, weekNumber, recipes: [{id}, ...]}
        const recommendedRecipes = getRecommendedRecipes();
        // recommendedRecipes가 null이 아닌 경우에만 추천 레시피 목록을 추가
        const recommendedRecipePayload = recommendedRecipes
          ? recommendedRecipes.recipes.map((r) => ({
              year: recommendedRecipes.year,
              weekNumber: recommendedRecipes.weekNumber,
              recipeId: r.id,
              isUsed: r.isUsed,
            }))
          : [];

        const loginRes = await AuthApi.signUpOrLogin({
          ...res.data,
          provider: res.data.provider.toLowerCase(),
          // favoriteRecipeIds가 존재하고, 빈 배열이 아닌 경우에만 loginData에 추가합니다.
          ...(favoriteRecipeIds && favoriteRecipeIds.length > 0
            ? { favoriteRecipeIds }
            : {}),
          // budget 이 존재하고, null 이 아닌 경우에만 loginData 에 추가.
          ...(budget != null
            ? {
                year: budget.year,
                weekNumber: budget.weekNumber,
                weeklyBudget: budget.amount,
              }
            : {}),
          // recommendedRecipePayload가 비어있지 않으면 loginData에 추가.
          ...(recommendedRecipePayload.length > 0
            ? { recommendedRecipes: recommendedRecipePayload }
            : {}),
        });

        if (loginRes.status === 200) {
          // 비회원 즐겨찾기 데이터 비우기
          clearFavoriteRecipeIds();
          toast.info('로그인 성공');

          // 로그인 성공하면 전역 상태에 로그인된 사용자 정보를 저장
          dispatch({
            type: 'LOGIN',
            payload: loginRes.data,
          });

          // 사용자 프로필 정보 조회해서 이 데이터가 있냐 없냐에 따라서 어느 페이지로 이동시킬지가 결정되잖아요.
          if (loginRes.data.userProfileUpdated) {
            // 로그인 성공 시 세션 스토리지에서 정보를 확인
            const pendingReview = JSON.parse(
              sessionStorage.getItem('pendingReview')
            );

            // 대기 중인 리뷰 정보가 있는 경우
            if (pendingReview && pendingReview.isReviewing) {
              const recipeId = pendingReview.recipeId;
              navigate(`/recipeDetail/${recipeId}`);
            } else {
              // 홈 화면 이동
              navigate('/home');
            }
          } else {
            // 프로필 업데이트 페이지로 이동
            navigate('/profile/update');
          }
        } else {
          // ableToLogin이 false인 경우 전역 상태에 사용자 정보 저장
          dispatch({
            type: 'SET_AUTH_DATA',
            payload: res, // 이메일 인증 절차를 위해 필요한 데이터 저장
          });

          setLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
      // TODO: 에러 발생 시 어느 페이지로 이동 시킬 지 결정 후 구현.
      // 에러 상태 코드, 그에 대한 메세지는 일괄적으로 설정. 홈으로 가기 > 로그아웃 처리 및 홈 화면 이동
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

  // 신규 회원가입한 회원이면,
  if (state.user && state.user.newUser && state.isAuthenticated) {
    navigate('/profile/update');
    return;
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
