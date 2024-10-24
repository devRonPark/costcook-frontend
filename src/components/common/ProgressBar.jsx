import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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
      </ProgressBarContainer>
      <ProgressBarTextBox>
        <ProgressBarText>0</ProgressBarText>
        <ProgressBarText>{budgetAmount}</ProgressBarText>
      </ProgressBarTextBox>
    </ProgressContainer>
  );
};

export default ProgressBar;

// Styled Components for ProgressBar
const ProgressContainer = styled.div`
  width: 100%;
  height: 60px;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #76c7c0;
  transition: width 0.3s ease-in-out;
`;

const ProgressBarTextBox = styled.div`
  height: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ProgressBarText = styled.div`
  height: 10px;
`;
