import styled from 'styled-components';
import BackButton from '../../common/Button/BackButton';

// HeaderContainer 스타일링 (배경색 흰색으로 설정)
const HeaderContainer = styled.header`
  box-sizing: border-box; // 박스 모델 설정
  height: 65px; // 헤더 높이
  width: 100%; // 전체 너비
  padding: 0 16px; // 좌우 패딩
  display: flex; // 플렉스 박스 설정
  align-items: center; // 수직 중앙 정렬
  justify-content: space-between; /* 아이콘과 제목 사이에 공간 분배 */
  background-color: #ffffff; // 배경색 흰색으로 설정
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // 약간의 그림자 효과
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: 0 auto;
`;

const ProfileUpdateHeader = ({ step, setStep }) => {
  // step이 2 또는 3일 때만 뒤로 가기 버튼을 보여주고 클릭 시 step을 감소시킴
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <HeaderContainer>
      {step > 1 && <BackButton onClick={handleBack} />}
      <HeaderTitle>프로필 업데이트</HeaderTitle>
    </HeaderContainer>
  );
};

export default ProfileUpdateHeader;
