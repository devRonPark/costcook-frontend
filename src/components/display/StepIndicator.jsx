import React from 'react';
import styled from 'styled-components';

const StyledStepIndicator = styled.div`
  font-size: 16px;
  text-align: right;
  margin: 20px 0;
`;

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <StyledStepIndicator>
      {currentStep}/{totalSteps}
    </StyledStepIndicator>
  );
};

export default StepIndicator;
