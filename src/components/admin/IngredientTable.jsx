import React from 'react';
import styled from 'styled-components';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // 추가된 MUI 아이콘
import unitData from '../../assets/data/units.json';

const IngredientTable = ({ ingredientList }) => {
  // 총 가격 합계 계산
  const grandTotal = ingredientList.reduce(
    (acc, ingredient) => acc + ingredient.price * ingredient.quantity,
    0
  );
  const formattedGrandTotal = parseFloat(grandTotal.toFixed(2));

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
          const unitName = unitData.find((unit) => unit.id === ingredient.unit_id)?.name || '';
          const totalPrice = parseFloat((ingredient.price * ingredient.quantity).toFixed(2));
          return (
            <TableRow key={ingredient.id}>
              <td>{ingredient.name}</td>
              <td>{`${ingredient.quantity}${unitName}`}</td>
              <PriceCell>
                {`${totalPrice % 1 === 0 ? totalPrice.toFixed(0) : totalPrice}원`}
                <MoreIconWrapper onClick={() => alert(`재료 ID: ${ingredient.id}`)}>
                  <MoreVertIcon />
                </MoreIconWrapper>
              </PriceCell>
            </TableRow>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="2" />
          <td>{`${formattedGrandTotal % 1 === 0 ? formattedGrandTotal.toFixed(0) : formattedGrandTotal}원`}</td>
        </tr>
      </tfoot>
    </StyledTable>
  );
};

export default IngredientTable;

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
  }

  th {
    background-color: #f2f2f2;
  }

  tbody td:nth-child(1) {
    width: 45%;
  }

  tbody td:nth-child(3) {
    width: 35%;
    position: relative; /* 아이콘 위치를 셀 내부에 고정하기 위해 설정 */
  }

  tfoot td {
    border: none;
  }

  tfoot td:last-child {
    font-weight: bold;
  }
`;

const PriceCell = styled.td`
  position: relative;
  text-align: left; /* 가격 텍스트를 왼쪽으로 정렬 */
`;

const MoreIconWrapper = styled.div`
  position: absolute;
  right: 4px;
  top: 55%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;

  &:hover {
    color: #000; /* 마우스를 올렸을 때 색 변경 */
  }
`;

const TableRow = styled.tr`
  position: relative;
`;


