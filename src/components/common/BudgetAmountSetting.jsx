import React from 'react';
import styled from 'styled-components';
import { formatPrice } from '../../utils/formatData';

const BudgetAmountSetting = ({ id, amount }) => {
  return <StyledBudgetNumber id={id}>{formatPrice(amount)}</StyledBudgetNumber>;
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

// 예시
// id: 1,
// useAmount: 88000,
// budgetAmount: 100000,
// cheapRecipe: 5000,
// recipeAvg: 18000,
// expensiveRecipe: 20000,
// date: '2024-10-23',
