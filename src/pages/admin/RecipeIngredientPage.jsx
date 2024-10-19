import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import unitsData from '../../assets/data/units.json';
import AdminLayout from '../../components/admin/AdminLayout';
import InfoContainer from '../../components/admin/InfoContainer';
import ContentContainer from '../../components/admin/ContentContainer';
import IngredientSearchSection from '../../components/admin/IngredientSearchSection';

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
      <InfoContainer ref={textRef} shouldAnimate={shouldAnimate}>
        {[`[재료] ${selectedIngredient ? selectedIngredient.name : '미입력'} / `]}
      </InfoContainer>

      <ContentContainer>
        <IngredientSearchSection
          onSelectIngredient={handleSelectIngredient}
          onSearchIngredient={handleSearch}
        />

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
      </ContentContainer>
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