import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ingredientsData from '../../assets/data/ingredients.json';
import unitsData from '../../assets/data/units.json';
import AdminLayout from '../../components/admin/AdminLayout';
import InfoWrapper from '../../components/admin/InfoWrapper';
import ContentWrapper from '../../components/admin/ContentWrapper';
import MovingText from '../../components/admin/MovingText';
import IngredientSearchContainer from '../../components/admin/IngredientSearchContainer';

const RecipeIngredientPage = () => {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const textRef = useRef(null);

  const isRegisterEnabled = Boolean(selectedIngredient);
  const isModified = Boolean(selectedIngredient);

  const unitName = selectedIngredient ? unitsData.find((unit) => unit.id === selectedIngredient.unit_id)?.name : '';

  useEffect(() => {
    if (textRef.current) {
      const containerWidth = textRef.current.parentElement.offsetWidth;
      const textWidth = textRef.current.scrollWidth;
      setShouldAnimate(textWidth > containerWidth);
    }
  }, [selectedIngredient]);

  const handleSelectIngredient = (ingredient) => {
    setSelectedIngredient(ingredient);
  };

  const handleSearch = (trimmedInput, filteredData) => {
    setSelectedIngredient(null);
  };

  

  return (
    <AdminLayout
      title="재료"
      rightLabel="등록"
      isRegisterEnabled={isRegisterEnabled}
      isModified={isModified}
    >
      <InfoWrapper>
        <MovingText ref={textRef} shouldAnimate={shouldAnimate}>
          {[`[재료] ${selectedIngredient ? selectedIngredient.name : '미입력'} / `]}
        </MovingText>
      </InfoWrapper>

      <ContentWrapper>
        <Section>
          <SectionTitle>재료 이름</SectionTitle>
          <IngredientSearchContainer
            data={ingredientsData}
            placeholder="재료 이름을 입력하세요"
            onSelectIngredient={handleSelectIngredient}
            onSearchIngredient={handleSearch}
          />
        </Section>

        {selectedIngredient && (
          <Section>
            <SectionTitle>재료 수량</SectionTitle>
            <QuantityInputWrapper>
              <div style={{ fontSize: '1rem' }}>
                몇 <span style={{ fontWeight: 'bold' }}>{unitName}</span> 넣으시겠습니까?
              </div>
              <QuantityInput type="number" min="1" />
            </QuantityInputWrapper>
          </Section>
        )}
      </ContentWrapper>
    </AdminLayout>
  );
};

export default RecipeIngredientPage;

// 스타일 컴포넌트 정의 영역

const Section = styled.div`
  margin-top: 24px; 
`;

const SectionTitle = styled.h2`
  margin-bottom: 16px;
`;

const QuantityInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; 
  gap: 8px;
  width: 100%;
`;

const QuantityInput = styled.input`
  width: 80px; 
  padding: 4px;
  font-size: 1rem;
  text-align: right;
  border: 1px solid #ccc; 
  border-radius: 4px;
`;