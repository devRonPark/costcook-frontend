import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import InfoContainer from '../../components/admin/InfoContainer';
import ContentContainer from '../../components/admin/ContentContainer';
import IngredientSearchSection from '../../components/admin/IngredientSearchSection';
import IngredientQuantitySection from '../../components/admin/IngredientQuantitySection';

const RecipeIngredientPage = ({ ingredientList, setIngredientList, onClose }) => {
  // 상태 : 선택된 재료
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  // 상태 : 재료의 수량
  const [quantity, setQuantity] = useState('');
  // 상태 : 재료 이름이 너무 길어져서 정보창에 한 줄로 표시되지 못해 왼쪽으로 이동할지?
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // 정보창에 보여줄 정보
  const textRef = useRef(null);

  // 재료와 수량이 모두 입력된 경우에만 등록 버튼 활성화
  const isRegisterEnabled = Boolean(selectedIngredient && quantity > 0);
  // 페이지 변경 경고 활성화 조건 (선택된 재료나 수량이 변경된 경우)
  const isModified = Boolean(selectedIngredient) || Boolean(quantity);

  // 선택된 재료에 표시되는 단위
  const unitName = selectedIngredient ? selectedIngredient.unit.name : '';

  // 애니메이션 체크 로직을 별도의 함수로 분리
  const checkShouldAnimate = () => {
    if (textRef.current) {
      const containerWidth = textRef.current.parentElement.offsetWidth;
      const textWidth = textRef.current.scrollWidth;
      setShouldAnimate(textWidth > containerWidth);
    }
  };

  useEffect(() => {
    checkShouldAnimate();
  }, [selectedIngredient]);

  // 이벤트 핸들러 : 재료를 검색했을 때
  const handleSearchIngredient = () => {
    setSelectedIngredient(null);
    setQuantity('');
  };

  // 이벤트 핸들러 : 재료를 선택했을 때
  const handleSelectIngredient = (newIngredient) => {
    setSelectedIngredient(newIngredient);
    setQuantity('');
  };

  // 이벤트 핸들러 : 재료 수량을 입력하고 확인 버튼을 눌렀을 때
  const handleQuantityConfirm = (newQuantity) => {
    setQuantity(newQuantity);
  };

  // useEffect : 수량과 재료가 모두 선택되면 등록하는 로직
  useEffect(() => {
    if (selectedIngredient && quantity) {
      handleSubmit();
    }
  }, [quantity, selectedIngredient]);

  // 이벤트 핸들러 : "등록" 버튼을 클릭했을 때
  const handleSubmit = () => {
    if (selectedIngredient && quantity) {
      const newIngredient = { 
        ...selectedIngredient, 
        quantity,
        unitName: selectedIngredient.unit.name 
      };

      // 재료 리스트에 새 재료 추가
      let updatedIngredientList = [...ingredientList, newIngredient];

      // 재료 리스트를 가나다 순으로 정렬
      updatedIngredientList = updatedIngredientList.sort((a, b) =>
        a.name.localeCompare(b.name, 'ko', { sensitivity: 'base' })
      );

      // 부모 컴포넌트의 재료 리스트 업데이트 함수 호출
      setIngredientList(updatedIngredientList);

      // 등록이 완료되면 부모 컴포넌트로 돌아가기 (모달을 닫는 방식)
      onClose();
    } else {
      alert('재료와 수량을 입력해 주세요.');
    }
  };

  // 이벤트 핸들러 : 뒤로가기 버튼을 클릭했을 때
  const handleBack = () => {
    // 재료 리스트는 변경하지 않고 모달을 닫음
    onClose();
  };

  return (
    <AdminLayout
      title="재료"
      isRegisterEnabled={isRegisterEnabled} // 재료와 수량이 모두 입력된 경우에만 등록 버튼 활성화
      isModified={isModified} // 페이지 변경 경고 활성화 여부
    >
      <InfoContainer ref={textRef} shouldAnimate={shouldAnimate}>
        {selectedIngredient
          ? `${selectedIngredient.name} ${quantity ? `${quantity}${unitName}` : ''}`
          : '선택된 재료가 없습니다.'}
      </InfoContainer>

      <ScrollableContentContainer>
        <IngredientSearchSection
          onSelectIngredient={handleSelectIngredient}
          onSearchIngredient={handleSearchIngredient}
          existingIngredients={ingredientList}
        />

        {selectedIngredient && (
          <IngredientQuantitySection
            unitName={unitName}
            onQuantityConfirm={handleQuantityConfirm} // 확인 버튼을 눌렀을 때 수량 업데이트 및 등록
            selectedIngredient={selectedIngredient}
          />
        )}
      </ScrollableContentContainer>
    </AdminLayout>
  );
};

export default RecipeIngredientPage;

import styled from 'styled-components';

const ScrollableContentContainer = styled(ContentContainer)`
  overflow-y: auto;
  max-height: 100vh;
  padding: 16px;

  /* 스크롤바 완전히 숨기기 */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera에서 숨기기 */
  }
  -ms-overflow-style: none;  /* IE와 Edge에서 숨기기 */
  scrollbar-width: none;  /* Firefox에서 숨기기 */
`;