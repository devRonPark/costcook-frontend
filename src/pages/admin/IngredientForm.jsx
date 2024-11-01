import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AdminLayout from '../../components/admin/AdminLayout';
import ButtonContainer from '../../components/admin/ButtonContainer';
import DuplicateContainer from '../../components/admin/DuplicateContainer';
import categoriesData from '../../assets/data/categories.json';
import unitsData from '../../assets/data/units.json';
import InfoContainer from '../../components/admin/InfoContainer';
import ContentContainer from '../../components/admin/ContentContainer';
import apiClient from '../../services/api';

const AdminIngredientForm = () => {

  // 다른 페이지로 이동하기 위한 함수
  const navigate = useNavigate();
  // 현재 위치 정보를 가져오기 위한 훅
  const location = useLocation();
  // 이전 페이지에서 전달된 재료 정보 (편집 모드에만 존재)
  const editingIngredient = location.state?.ingredient;
  // true이면 편집 모드, false이면 추가 모드
  const isEditingIngredient = !!editingIngredient;

  // [1] 초기 상태
  
  const initialState = {
    name: editingIngredient?.name || '',
    categoryId: editingIngredient?.category?.id || '',
    unitId: editingIngredient?.unit?.id || '', 
    price: editingIngredient?.pricePerUnit || 0
  }

  // [2] 상태 관리

  const [currentState, setCurrentState] = useState(initialState);
  const [isNameUnique, setIsNameUnique] = useState(isEditingIngredient);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const textRef = useRef(null);

  // [3] 핸들러 함수

  const handleInputChange = (key, value) => { 
    setCurrentState((prevState) => ({ ...prevState, [key]: value }));
  };

  const handlePriceChange = (value) => {
    // 만개 번호는 유효성 검사를 수행함.
    if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0)) {
      handleInputChange('price', String(Number(value)) || '');
    } else {
      alert("가격은 0 또는 자연수여야 합니다.");
    }
  };

  const handleCheckDuplicate = (ingredientName, isDuplicate) => {
    if (!isDuplicate) {
      handleInputChange('name', ingredientName);
      setIsNameUnique(true);
    } else {
      alert('이미 존재하는 재료입니다. 다른 이름을 선택해주세요.');
      handleInputChange('name', '');
      setIsNameUnique(false);
    }
  };

  // [4] 유틸리티 함수

  const getNameById = (data, id) => {
    const defaultName = '미선택';
    return id !== null ? data.find((item) => item.id === id)?.name || defaultName : defaultName;
  };

  // [5] useEffect 

  // 정보창에 글자가 너무 많아 한번에 모두 볼 수 없으면 이동 애니메이션을 부여함
  useEffect(() => {
    if (textRef.current) {
      const containerWidth = textRef.current.parentElement.offsetWidth;
      const textWidth = textRef.current.scrollWidth;
      setShouldAnimate(textWidth > containerWidth);
    }
  }, [currentState]);

  // 수정 모드일 경우 다른 페이지에서 가져온 데이터를 초기 상태에 반영함
  useEffect(() => {
    if (isEditingIngredient) {
      setCurrentState(initialState);
    }
  }, []);


  // [6] 상단 버튼

  // "등록" 버튼 활성화 조건
  const isRegisterEnabled = Boolean(isNameUnique) && Boolean(currentState.unitId) && Boolean(currentState.categoryId) && currentState.price >= 0;

  // "Exit" 모달 활성화 조건
  const isModified = Boolean(currentState.name) || Boolean(currentState.unitId) || Boolean(currentState.categoryId) || currentState.price >= 0;

  // 서버로 등록 요청
  const onSubmit = async () => {
    /*
    try {
      const requestData = {
        ingredient: selectedIngredient,
        unitId: selectedUnit,
        categoryId: selectedCategory,
      };

      const response = await apiClient.post('/api/admin/ingredients', requestData);

      if (response.status === 200) {
        alert('재료가 성공적으로 등록되었습니다!');
      } else {
        alert('등록에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('서버 통신 에러:', error);
      // alert('서버와 통신 중 문제가 발생했습니다. 다시 시도해주세요.');
      alert(`API: /api/admin/ingredients\n\n데이터: ${JSON.stringify({
        ingredient: selectedIngredient,
        unitId: selectedUnit,
        categoryId: selectedCategory,
      }, null, 2)}`);
    }
      */
  };

  return (
    <AdminLayout
      title="재료"
      rightLabel={isEditingIngredient ? '수정' : '등록'}
      isRegisterEnabled={isRegisterEnabled}
      isModified={isModified} 
      onSubmit={onSubmit} 
    >
      <InfoContainer ref={textRef} shouldAnimate={shouldAnimate}>
        {[`[재료] ${currentState.name || '미입력'} / `, 
          `[단위] ${getNameById(unitsData, currentState.unitId)} / `, 
          `[카테고리] ${getNameById(categoriesData, currentState.categoryId)}`]
          .join('')
        }
      </InfoContainer>

      <ContentContainer>
        <Section style={{marginTop: '80px'}}>
          <SectionTitle>재료 이름</SectionTitle>
          <DuplicateContainer
            apiEndpoint="/admin/ingredients/duplicate"
            queryParamName="ingredientName"
            placeholder="재료 이름을 입력하세요"
            onCheckDuplicate={handleCheckDuplicate}
            isEditing={isEditingIngredient}
            defaultValue={editingIngredient?.name || ''}
          />
        </Section>

        <Section>
          <SectionTitle>재료 단위</SectionTitle>
          <ButtonContainer
            items={unitsData.map((unit) => ({ ...unit, type: 'unit' }))}
            selectedId={currentState.unitId}
            onItemClick={(unit) => handleInputChange('unitId', unit?.id || null)} // 선택 해제 시 null 전달
          />
        </Section>

        <Section>
          <SectionTitle>카테고리</SectionTitle>
          <ButtonContainer
            items={categoriesData.map((category) => ({ ...category, type: 'category' }))}
            selectedId={currentState.categoryId}
            onItemClick={(category) => handleInputChange('categoryId', category?.id || null)} // 선택 해제 시 null 전달
          />
        </Section>

        <Section>
          <SectionTitle>가격</SectionTitle>
          <StyledInput
              type="number"
              placeholder="가격"
              value={currentState.price}
              onChange={(e) => handlePriceChange(e.target.value)}
          />
        </Section>
      </ContentContainer>
    </AdminLayout>
  );
};

export default AdminIngredientForm;

const Section = styled.div`
  margin-top: 24px; 
`;

const SectionTitle = styled.h2`
  margin-bottom: 16px;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;

  &::placeholder {
    color: #aaa;
  }
`;