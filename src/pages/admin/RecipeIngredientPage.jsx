import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import AdminLayout from '../../components/admin/AdminLayout';
import SearchContainer from '../../components/admin/SearchContainer';
import ingredientsData from '../../assets/data/ingredients.json';
import SelectedInfoContainer from '../../components/admin/SelectedInfoContainer';
import MovingText from '../../components/admin/MovingText';
import ContentContainer from '../../components/admin/ContentContainer';

const RecipeIngredientPage = () => {
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const containerWidth = textRef.current.parentElement.offsetWidth;
      const textWidth = textRef.current.scrollWidth;
      setShouldAnimate(textWidth > containerWidth);
    }
  }, [selectedIngredient]);

  const handleCheckDuplicate = (ingredientName, isDuplicate) => {
    if (!isDuplicate) {
      setSelectedIngredient(ingredientName);
    } else {
      alert('이미 존재하는 재료입니다. 다른 이름을 선택해주세요.');
      setSelectedIngredient('');
    }
  };

  // "등록" 버튼 활성화 여부 결정
  const isRegisterEnabled = Boolean(selectedIngredient);

  // 하나 이상의 입력된 값이 있는지 여부 판단
  const isModified = Boolean(selectedIngredient);

  return (
    <AdminLayout
      title="재료"
      rightLabel="등록"
      isRegisterEnabled={isRegisterEnabled}
      isModified={isModified} // 입력값 변경 여부 전달
    >
      <SelectedInfoContainer>
        <MovingText ref={textRef} shouldAnimate={shouldAnimate}>
          {[`[재료] ${selectedIngredient || '미입력'} / `]}
        </MovingText>
      </SelectedInfoContainer>

      <ContentContainer>
        <Section>
          <SectionTitle>재료 이름</SectionTitle>
          <SearchContainer
            data={ingredientsData}
            placeholder="재료 이름을 입력하세요"
            onCheckDuplicate={handleCheckDuplicate}
          />
        </Section>
      </ContentContainer>
    </AdminLayout>
  );
};

export default RecipeIngredientPage;

const Section = styled.div`
  margin-top: 24px; 
`;

const SectionTitle = styled.h2`
  margin-bottom: 16px;
`;