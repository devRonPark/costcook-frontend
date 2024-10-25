import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
import unitData from '../../assets/data/units.json';

const IngredientTable = ({ ingredientList, isEditing, onDeleteIngredient, onUpdateIngredient, onTotalCostChange }) => {
  // 레시피 전체의 총 비용 계산
  const totalCost = ingredientList.reduce(
    (acc, ingredient) => acc + ingredient.pricePerUnit * ingredient.quantity,
    0
  );
  const formattedTotalCost = parseFloat(totalCost.toFixed(2));

  // totalCost 변경 시 상위 컴포넌트에 전달
  useEffect(() => {
    onTotalCostChange(totalCost);
  }, [totalCost]);

  return (
    <StyledTable>
      <thead>
        <tr>
          <th>이름</th>
          <th>수량</th>
          <th>가격</th>
        </tr>
      </thead>
      <tbody>
        {ingredientList.map((ingredient) => {
          const unitName = ingredient.unitName;
          const ingredientCost = parseFloat((ingredient.pricePerUnit * ingredient.quantity).toFixed(2));
          return (
            <TableRow key={ingredient.id}>
              <td>{ingredient.name}</td>
              <QuantityCell>
                {isEditing ? (
                  <InputContainer>
                    <StyledInput
                      type="number"
                      value={ingredient.quantity}
                      onChange={(e) => {
                        const newQuantity = Number(e.target.value);
                        if (newQuantity >= 0) {
                          // 음수는 입력 불가
                          onUpdateIngredient(ingredient.id, newQuantity);
                        }
                      }}
                      onBlur={() => {
                        // 편집 완료 시 수량이 0이면 1로 변경
                        if (ingredient.quantity <= 0) {
                          onUpdateIngredient(ingredient.id, 1);
                        }
                      }}
                    />
                    <UnitName>{unitName}</UnitName>
                  </InputContainer>
                ) : (
                  <TextCell className="unit-text">
                    {Number(ingredient.quantity)}{unitName}
                  </TextCell>
                )}
              </QuantityCell>
              <PriceCell>
                {`${ingredientCost % 1 === 0 ? ingredientCost.toFixed(0) : ingredientCost}원`}
                {isEditing && (
                  <DeleteIconWrapper onClick={() => onDeleteIngredient(ingredient.id)}>
                    <DeleteIcon />
                  </DeleteIconWrapper>
                )}
              </PriceCell>
            </TableRow>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="2">총 가격</td>
          <TotalPriceCell>
            {`${formattedTotalCost % 1 === 0 ? formattedTotalCost.toFixed(0) : formattedTotalCost}원`}
          </TotalPriceCell>
        </tr>
      </tfoot>
    </StyledTable>
  );
};

export default IngredientTable;

// 스타일 컴포넌트 정의

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    width: 20%;
    height: 40px; 
    vertical-align: middle; 
  }

  th {
    background-color: #f2f2f2;
  }

  tbody td:nth-child(1) {
    width: 45%;
  }

  tbody td:nth-child(2) {
    width: 25%;
  }

  tbody td:nth-child(3) {
    width: 30%;
    position: relative; 
  }

  tfoot td {
    border-top: 2px solid #ddd;
    font-weight: bold;
  }

  tfoot td:last-child {
    text-align: center;
  }
`;

const TableRow = styled.tr`
  position: relative;
`;

const QuantityCell = styled.td`
  height: 40px;
  text-align: center;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledInput = styled.input`
  width: 60px;
  padding: 4px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.5;
  margin-right: 4px;
  height: 36px;

  /* 화살표 아이콘 제거 */
  -webkit-appearance: none; 
  -moz-appearance: textfield; /* Firefox */
  appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextCell = styled.span`
  display: inline-block;
  width: 60px; 
  height: 36px; 
  line-height: 36px; 
  text-align: center;
`;

const UnitName = styled.span`
  font-size: 1rem;
  color: #000;
`;

const PriceCell = styled.td`
  position: relative;
  text-align: left;
`;

const DeleteIconWrapper = styled.div`
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #e74c3c;

  &:hover {
    color: #c0392b; /* 조금 더 어두운 빨간색으로 변경 */
  }
`;

const TotalPriceCell = styled.td`
  font-weight: bold;
  text-align: center;
  color: #000;
`;