import React from 'react';
import styled from 'styled-components';
import { formatPrice } from '../../utils/formatData';
import { Link } from 'react-router-dom';

const BudgetAmountSetting = ({ id, amount, title, recipeId }) => {
  return (
    <StyledBudgetNumber id={id}>
      {title && recipeId ? ( // 가장 저렴한or비싼 레시피 상세보기 링크
        <StyledLink to={`/recipes/${recipeId}`}>
          <Title>{title}</Title>
          <Amount>{formatPrice(amount)} 원</Amount>
        </StyledLink>
      ) : (
        <Amount>{formatPrice(amount)} 원</Amount>
      )}
    </StyledBudgetNumber>
  );
};

export default BudgetAmountSetting;

// Styled Component 정의

const StyledLink = styled(Link)`
  text-align: center;
`;

const StyledBudgetNumber = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Amount = styled.div`
  font-weight: bold;
`;

const Title = styled.div`
  font-size: 12px;
  color: gray;
`;
