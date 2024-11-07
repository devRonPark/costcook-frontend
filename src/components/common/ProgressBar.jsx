import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatPrice } from '../../utils/formatData';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProgressBar = ({ useAmount, budgetAmount, isCurrentWeek }) => {
  const [progress, setProgress] = useState(0);

  // 사용 예산에 따른 진행 상황 업데이트
  useEffect(() => {
    const newProgress = (useAmount / budgetAmount) * 100;
    setProgress(newProgress);
  }, [useAmount, budgetAmount]);

  // 예산 미사용시, 홈으로 보내는 버튼 클릭 시 toast 출력
  const handleLinkCilck = () => {
    toast.info('추천받은 레시피를 선택하여\n 요리해보세요!', {
      className: 'custom-toast',
    });
  };

  return (
    <ProgressContainer>
      <ProgressBarContainer>
        {isCurrentWeek && useAmount === 0 ? (
          <LinkButton to="/home" onClick={handleLinkCilck}>
            <p style={{ margin: '8px' }}>
              아직 사용한 예산이 없네요! 요리하러 가볼까요?
            </p>
          </LinkButton>
        ) : (
          <>
            <ProgressBarFill style={{ width: `${progress}%` }} />
            <ProgressPercentageText>
              {progress.toFixed(2)}%
            </ProgressPercentageText>
          </>
        )}
      </ProgressBarContainer>
      <ProgressBarTextBox>
        <ProgressBarText>0</ProgressBarText>
        <ProgressBarText>{formatPrice(budgetAmount)}</ProgressBarText>
      </ProgressBarTextBox>
    </ProgressContainer>
  );
};

export default ProgressBar;

// Styled Components for ProgressBar
const ProgressContainer = styled.div`
  width: 100%;
  height: 60px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 10px;
  position: relative;
  overflow: hidden; // 자식 요소의 overflow 숨김
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #76c7c0;
  background: linear-gradient(90deg, #76c7c0, #4caf50);
  transition: width 0.3s ease-in-out;
`;

const ProgressBarTextBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProgressBarText = styled.div`
  font-family: 'GangwonEdu_OTFBoldA';
  height: 10px;
  font-size: 16px;
`;

const ProgressPercentageText = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-weight: bold;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const LinkButton = styled(Link)`
  text-align: center;
  border-radius: 10px;
  font-size: 20px;
  color: orange;
  font-family: 'GangwonEduPowerExtraBoldA';
`;
