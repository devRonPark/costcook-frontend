import { CircularProgress, Typography } from '@mui/material';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 전체 화면 높이 */
  max-width: 600px; /* 최대 너비 */
  margin: auto; /* 좌우 가운데 정렬 */
`;

const LoadingText = styled(Typography)`
  margin-top: 16px; /* 로딩 스피너와 텍스트 사이의 간격 */
`;

const LoadingComponent = ({ loading, loadingText }) => {
  // 로딩 중인 경우
  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress /> {/* Material-UI 로딩 스피너 */}
        <LoadingText variant="h5">{loadingText}</LoadingText>
      </LoadingContainer>
    );
  }

  return null; // 로딩 중이 아닐 경우 아무것도 렌더링하지 않음
};

export default LoadingComponent;
