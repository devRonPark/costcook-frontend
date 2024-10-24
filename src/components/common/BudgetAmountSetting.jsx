import React from 'react';
import styled from 'styled-components';

const BudgetAmountSetting = ({ id, amount }) => {
  return <StyledBudgetNumber id={id}>{amount}</StyledBudgetNumber>;
};

export default BudgetAmountSetting;

// Styled Component 정의
const StyledBudgetNumber = styled.div`
  height: 50px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  align-items: center;
`;
