import { useNavigate } from 'react-router-dom';
import Description from '../components/common/Text/Description';
import Title from '../components/common/Text/Title';
import ImageDisplay from '../components/display/ImageDisplay';
import PageContainer from '../components/layout/PageContainer';
import RoundedButton from '../components/common/Button/RoundedButton';

const SignUpComplete = () => {
  const navigate = useNavigate();
  return (
    <PageContainer>
      <Title text="가입이 완료되었습니다!" />

      <Description text="쉽고 재미있는 요리생활을" margin="30px auto 0 auto" />
      <Description text="함께 즐겨봐요!" margin="0 auto" />
      <ImageDisplay
        src={`${import.meta.env.VITE_PUBLIC_URL}/signup_welcome_image.png`}
        altText="회원가입 완료 환영"
        borderRadius="0"
        border="none"
        backgroundColor="none"
        margin="30px auto 0 auto"
      />
      <RoundedButton
        text="시작하기"
        onClick={() => navigate('/home')} // 홈으로 이동
        backgroundColor="#ffc247"
        hoverBackgroundColor="#ff9f2a"
      />
    </PageContainer>
  );
};

export default SignUpComplete;
