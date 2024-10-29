import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const IngredientQuantitySection = ({ unitName, onQuantityConfirm, selectedIngredient }) => {
  
  /* 상위 컴포넌트(RecipeIngredientPage)로부터 전달되는 props
    1. unitName : 해당 재료의 단위명
    2. onQuantityConfirm: 사용자가 수량을 입력하고 확인 버튼을 눌렀을 때 호출되는 함수
    3. selectedIngredient: 사용자가 선택한 재료
  */
  
  // 상태 : 해당 재료의 수량
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    setQuantity(''); // 재료가 변경되면 수량을 비움
  }, [selectedIngredient]);


  // 이벤트 핸들러 : 사용자가 입력 창에서 수량을 입력(변경)할 때 
  const handleInputChange = (e) => {
    const {value} = e.target;

    // 숫자와 소수점만 허용
    const onlyNumbers = value.replace(/[^0-9.]/g, ''); 

    // 소수점이 1개만 허용되도록 처리
    const isValid = /^[0-9]*\.?[0-9]*$/.test(onlyNumbers);

    if (isValid) {
      setQuantity(onlyNumbers);
    }
  };

  // 이벤트 핸들러 : 사용자가 확인 버튼을 눌렀을 때
  const handleConfirmClick = () => {
    // 수량을 상위 컴포넌트로 전달
    onQuantityConfirm(quantity);  
  };

  // 이벤트 핸들러 : 사용자가 "Enter" 키를 눌렀을 때 
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onQuantityConfirm(quantity);  
    }
  };

  // 수량이 입력되면 입력창에 placeholder가 사라지고 재료 단위가 오른쪽에 표시됨

  return (
    <Section>
      <h2>재료 수량</h2>
      <InputWrapper>
        <StyledInput
          type="text"
          placeholder={`몇 ${unitName || '단위'} 넣으시겠습니까?`}
          value={quantity}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        {quantity && <UnitLabel>{unitName}</UnitLabel>}
        <ConfirmButton onClick={handleConfirmClick}>확인</ConfirmButton>
      </InputWrapper>
    </Section>
  );
};

export default IngredientQuantitySection;

// 전체 영역
const Section = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 30px auto;
  display: flex;
  flex-direction: column;
`;

// 입력창과 검색 버튼을 담고 있는 영역
const InputWrapper = styled.div`
  position: relative; /* UnitLabel을 StyledInput의 오른쪽에 위치시키기 위한 설정 */
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 16px;
`;

// 입력창
const StyledInput = styled.input`
  flex: 1;
  padding: 12px;
  height: 48px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;

  &::placeholder {
    color: #aaa;
  }
`;

// 입력 필드의 오른쪽 내부에 단위 표시
const UnitLabel = styled.span`
  position: absolute;
  right: min(96px, 30%); 
  font-size: 1rem;
  color: #666;
  top: 50%;
  transform: translateY(-50%);
`;

// 확인 버튼
const ConfirmButton = styled.button`
  height: 48px;
  padding: 0 20px;
  background-color: #ffc107;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0a800;  // 배경 색상이 더 짙어짐
  }
`;