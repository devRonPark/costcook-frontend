import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import unitList from '../../assets/data/units.json';
import AdminLayout from '../../components/admin/AdminLayout';
import InfoContainer from '../../components/admin/InfoContainer';
import ContentContainer from '../../components/admin/ContentContainer';
import IngredientSearchSection from '../../components/admin/IngredientSearchSection';
import IngredientQuantitySection from '../../components/admin/IngredientQuantitySection';


const RecipeIngredientPage = () => {

  const navigate = useNavigate();
  const { state } = useLocation();

  // 상태: 재료 리스트
  const [ingredientList, setIngredientList] = useState(state?.ingredientList || []);

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

  // 재료나 수량이 입력된 경우 Exit 모달 활성화
  const isModified = Boolean(selectedIngredient) || Boolean(quantity); 
  
  // 선택된 재료에 표시되는 단위 (더미 데이터)
  const unitName = selectedIngredient 
  ? unitList.find((unit) => unit.id === selectedIngredient.unit_id)?.name 
  : '';
  
  
  useEffect(() => {
    if (textRef.current) {
      const containerWidth = textRef.current.parentElement.offsetWidth;
      const textWidth = textRef.current.scrollWidth;
      setShouldAnimate(textWidth > containerWidth);
    }
  }, [selectedIngredient]);


  // 이벤트 핸들러 : 재료를 검색했을 때
  const handleSearchIngredient = () => {
    // 재료를 초기화
    setSelectedIngredient(null);

    // 수량을 초기화
    setQuantity(''); 
  };

  // 이벤트 핸들러 : 재료를 선택했을 때 
  const handleSelectIngredient = (newIngredient) => {
    // 재료를 업데이트함
    setSelectedIngredient(newIngredient);
    
    // 수량을 초기화
    setQuantity(''); 
  };

  // 이벤트 핸들러 : 재료 수량을 입력하고 확인 버튼을 눌렀을 때
  const handleQuantityConfirm = (newQuantity) => {
    // 수량을 업데이트함
    setQuantity(newQuantity);
  };

  // 이벤트 핸들러 : "등록" 버튼을 클릭했을 때
  const handleSubmit = () => {
    if (selectedIngredient && quantity) {
      const newIngredient = {...selectedIngredient, quantity};
  
      // 재료 리스트에 새 재료 추가
      let updatedIngredientList = [...ingredientList, newIngredient];
  
      // 재료 리스트를 가나다 순으로 정렬
      updatedIngredientList = updatedIngredientList.sort((a, b) =>
        a.name.localeCompare(b.name, 'ko', { sensitivity: 'base' })
      );
  
      // AdminRecipePage로 돌아가면서 재료 리스트를 전달
      navigate('/admin/recipe', {
        state: {
          ingredientList: updatedIngredientList
        },
      });
    } else {
      alert('재료와 수량을 입력해 주세요.');
    }
  };
  
  return (
    <AdminLayout
      title="재료"
      rightLabel="등록"
      isRegisterEnabled={isRegisterEnabled}  // 재료와 수량이 모두 입력된 경우에만 등록 버튼 활성화
      isModified={isModified}
      onSubmit={handleSubmit}
    >
      <InfoContainer ref={textRef} shouldAnimate={shouldAnimate}>
        {selectedIngredient
          ? `${selectedIngredient.name} ${quantity ? `${quantity}${unitName}` : ''}`
          : '선택된 재료가 없습니다.'}
      </InfoContainer>

      <ContentContainer>
        <IngredientSearchSection
          onSelectIngredient={handleSelectIngredient}
          onSearchIngredient={handleSearchIngredient}
          existingIngredients={ingredientList}
        />

        {selectedIngredient && (
          <IngredientQuantitySection
            unitName={unitName} 
            onQuantityConfirm={handleQuantityConfirm}  // 확인 버튼을 눌렀을 때만 수량 업데이트
            onResetIngredient={selectedIngredient} 
          />
        )}
      </ContentContainer>
    </AdminLayout>
  );
};

export default RecipeIngredientPage;
