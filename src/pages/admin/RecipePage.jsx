import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentContainer from '../../components/admin/ContentContainer';
import ingredientData from '../../assets/data/ingredients.json';
import IngredientTable from '../../components/admin/IngredientTable';
import ServingsWrapper from '../../components/admin/ServingsWrapper';
import RecipeIngredientPage from './RecipeIngredientPage';

const AdminRecipePage = () => {
  // 상태 : 레시피 이름, 식사량, 재료 리스트
  const [recipeName, setRecipeName] = useState('');
  const [servings, setServings] = useState(1);
  const [ingredientList, setIngredientList] = useState(
    ingredientData.slice(0, 3).map((ingredient) => ({
      ...ingredient,
      quantity: 1,
    }))
  );

  // 모달이 열렸는지?
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기
  const openModal = () => setIsModalOpen(true);

  // 모달 닫기
  const closeModal = () => setIsModalOpen(false);

  // 등록 버튼 활성화 조건
  const isRegisterEnabled = Boolean(recipeName) && ingredientList.length > 0;

  // 페이지 변경 경고 활성화 조건
  const isModified = Boolean(recipeName) || ingredientList.length > 0;

  // 서버로 등록 요청
  const handleSubmit = async () => {
    try {
      const requestData = {
        recipeName,
        servings,
        ingredients: ingredientList,
      };

      const response = await axios.post('/api/admin/recipes', requestData);

      if (response.status === 200) {
        alert('레시피가 성공적으로 등록되었습니다!');
      } else {
        alert('등록에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('서버 통신 에러:', error);
    }
  };

  return (
    <AdminLayout
      title="레시피"
      rightLabel="등록"
      isRegisterEnabled={isRegisterEnabled} // 등록 버튼 활성화 여부
      isModified={isModified}  // 페이지 변경 감지 여부 (경고 모달용)
      onSubmit={handleSubmit}  // 등록 버튼 클릭 시 호출될 함수
    >
      <ContentContainer>
        {/* 레시피 이름 입력 섹션 */}
        <Section>
          <SectionTitle>레시피 이름</SectionTitle>
          <StyledInput
            type="text"
            placeholder="레시피 이름을 입력하세요"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
          />
        </Section>

        {/* 레시피 식사량 설정 섹션 */}
        <Section>
          <SectionTitle>레시피 식사량</SectionTitle>
          <ServingsWrapper value={servings} onChange={(e) => setServings(Number(e.target.value))} />
        </Section>

        {/* 레시피 재료 관리 섹션 */}
        <Section>
          <SectionTitleWrapper>
            <SectionTitle>레시피 재료</SectionTitle>
            <AddButton onClick={openModal}>추가</AddButton>
          </SectionTitleWrapper>
          <IngredientTable
            ingredientList={ingredientList}
            onDeleteIngredient={(ingredientId) => {
              setIngredientList((prevList) =>
                prevList.filter((ingredient) => ingredient.id !== ingredientId)
              );
            }}
          />
        </Section>

        {/* RecipeIngredientPage 컴포넌트를 렌더링 */}
        {isModalOpen && (
          <ModalWrapper>
            <RecipeIngredientPage
              ingredientList={ingredientList}
              setIngredientList={setIngredientList}
              onClose={closeModal}
            />
          </ModalWrapper>
        )}
      </ContentContainer>
    </AdminLayout>
  );
};

export default AdminRecipePage;


// 스타일링 컴포넌트

const Section = styled.div`
  margin-top: 24px;
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  margin-bottom: 16px;
`;

const AddButton = styled.button`
  background-color: #17c3b2;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #14a699;
  }
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

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;