// src/pages/admin/MaterialPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios'; // 서버에 데이터를 보내기 위해 추가
import AdminLayout from '../../components/admin/AdminLayout';
import ButtonContainer from '../../components/admin/ButtonContainer';
import DuplicateContainer from '../../components/admin/DuplicateContainer';
import unitsData from '../../assets/data/units.json';
import categoriesData from '../../assets/data/categories.json';
import materialsData from '../../assets/data/materials.json';

const MaterialPage = () => {
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const containerWidth = textRef.current.parentElement.offsetWidth;
      const textWidth = textRef.current.scrollWidth;
      setShouldAnimate(textWidth > containerWidth);
    }
  }, [selectedMaterial, selectedUnit, selectedCategory]);

  const handleCheckDuplicate = (materialName, isDuplicate) => {
    if (!isDuplicate) {
      setSelectedMaterial(materialName);
    } else {
      alert('이미 존재하는 재료입니다. 다른 이름을 선택해주세요.');
      setSelectedMaterial('');
    }
  };

  const handleUnitSelect = (unit) => {
    setSelectedUnit(selectedUnit === unit.id ? null : unit.id);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(selectedCategory === category.id ? null : category.id);
  };

  // "등록" 버튼 활성화 여부 결정
  const isRegisterEnabled = Boolean(selectedMaterial) && selectedUnit !== null && selectedCategory !== null;

  // 하나 이상의 입력된 값이 있는지 여부 판단
  const isModified = Boolean(selectedMaterial) || selectedUnit !== null || selectedCategory !== null;

  // 서버로 등록 요청
  const onSubmit = async () => {
    try {
      const requestData = {
        material: selectedMaterial,
        unitId: selectedUnit,
        categoryId: selectedCategory,
      };

      const response = await axios.post('/api/admin/ingredients', requestData);

      if (response.status === 200) {
        alert('재료가 성공적으로 등록되었습니다!');
      } else {
        alert('등록에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('서버 통신 에러:', error);
      // alert('서버와 통신 중 문제가 발생했습니다. 다시 시도해주세요.');
      alert(`API: /api/admin/ingredients\n\n데이터: ${JSON.stringify({
        material: selectedMaterial,
        unitId: selectedUnit,
        categoryId: selectedCategory,
      }, null, 2)}`);
    }
  };

  return (
    <AdminLayout
      title="재료 관리"
      rightLabel="등록"
      isRegisterEnabled={isRegisterEnabled}
      isModified={isModified} // 입력값 변경 여부 전달
      onSubmit={onSubmit} // 등록 함수 전달
    >
      <SelectedInfoContainer>
        <MarqueeText ref={textRef} shouldAnimate={shouldAnimate}>
          {[`[재료] ${selectedMaterial || '미입력'} / `,
          `[단위] ${selectedUnit !== null ? `${unitsData.find((unit) => unit.id === selectedUnit)?.name}` : '미선택'} / `,
          `[카테고리] ${selectedCategory !== null ? `${categoriesData.find((category) => category.id === selectedCategory)?.name}` : '미선택'}`].join('')}
        </MarqueeText>
      </SelectedInfoContainer>

      <ContentContainer>
        <Section>
          <SectionTitle>재료 이름</SectionTitle>
          <DuplicateContainer
            data={materialsData}
            placeholder="재료 이름을 입력하세요"
            onCheckDuplicate={handleCheckDuplicate}
          />
        </Section>

        <Section>
          <SectionTitle>재료 단위</SectionTitle>
          <ButtonContainer
            items={unitsData.map((unit) => ({ ...unit, type: 'unit' }))}
            onItemClick={handleUnitSelect}
          />
        </Section>

        <Section>
          <SectionTitle>카테고리</SectionTitle>
          <ButtonContainer
            items={categoriesData.map((category) => ({ ...category, type: 'category' }))}
            onItemClick={handleCategorySelect}
          />
        </Section>
      </ContentContainer>
    </AdminLayout>
  );
};

export default MaterialPage;

// 스타일 컴포넌트 정의
const SelectedInfoContainer = styled.div`
  position: fixed; 
  top: 64px; 
  left: 50%; 
  transform: translateX(-50%); 
  width: 100%;
  max-width: 600px;
  padding: 20px; 
  background-color: #ffc107; 
  color: white; 
  text-align: center; 
  font-weight: bold;
  z-index: 1000; 
  box-sizing: border-box;
  border: 1px solid rgb(224, 224, 224);
  border-top: none;
`;

const MarqueeText = styled.div`
  display: inline-block;
  white-space: nowrap; 
  ${({ shouldAnimate }) =>
    shouldAnimate
      ? `animation: marquee 15s linear infinite;`
      : 'transform: translateX(0); text-align: center;'}
  
  @keyframes marquee {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

const ContentContainer = styled.div`
  padding: 16px;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
  margin-top: 140px; 
`;

const Section = styled.div`
  margin-top: 24px; 
`;

const SectionTitle = styled.h2`
  margin-bottom: 16px;
`;
