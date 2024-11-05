import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatPrice } from '../../utils/formatData';

const ProgressBar = ({ useAmount, budgetAmount }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress = (useAmount / budgetAmount) * 100;
    setProgress(newProgress);
  }, [useAmount, budgetAmount]);

  return (
    <ProgressContainer>
      <ProgressBarContainer>
        <ProgressBarFill style={{ width: `${progress}%` }} />
        <ProgressPercentageText>{progress.toFixed(2)}%</ProgressPercentageText>
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
  height: 10px;
  font-size: 14px;
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
