import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentContainer from '../../components/admin/ContentContainer';
import menuData from '../../assets/data/menus.json';
import ingredientData from '../../assets/data/ingredients.json';
import IngredientTable from '../../components/admin/IngredientTable';
import RecipeIngredientPage from './RecipeIngredientPage';
import SelectWrapper from '../../components/admin/SelectWrapper';

const AdminRecipePage = () => {
  // 상태 : 레시피 이름, 식사량, 재료 리스트
  const [recipeName, setRecipeName] = useState('');
  const [servings, setServings] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState(1);
  const [ingredientList, setIngredientList] = useState(
    ingredientData.slice(0, 3).map((ingredient) => ({
      ...ingredient,
      quantity: 1,
    }))
  );

  // 편집 상태 추가
  const [isEditing, setIsEditing] = useState(false);

  // 모달이 열렸는지?
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
    setIsEditing(false); // 모달을 열 때 편집 상태를 해제
  };

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

  // 재료 수량 업데이트 함수
  const handleUpdateIngredient = (ingredientId, newQuantity) => {
    setIngredientList((prevList) =>
      prevList.map((ingredient) =>
        ingredient.id === ingredientId ? { ...ingredient, quantity: newQuantity } : ingredient
      )
    );
  };

  // 편집 모드 변경 핸들러
  const toggleEditMode = () => setIsEditing((prev) => !prev);

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

        {/* 레시피 카테고리 설정 섹션 */}
        <Section>
          <SectionTitle>레시피 카테고리</SectionTitle>
          <SelectWrapper value={selectedMenu} onChange={(e) => setSelectedMenu(e.target.value)}>
            {menuData.map((menu) => (
              <option key={menu.id} value={menu.name}>
                {menu.name}
              </option>
            ))}
          </SelectWrapper>
        </Section>

        {/* 레시피 식사량 설정 섹션 */}
        <Section>
          <SectionTitle>레시피 식사량</SectionTitle>
          <SelectWrapper value={servings} onChange={(e) => setServings(Number(e.target.value))}>
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num}인분
              </option>
            ))}
          </SelectWrapper>
        </Section>

        {/* 레시피 재료 관리 섹션 */}
        <Section>
          <SectionTitleWrapper>
            <SectionTitle>레시피 재료</SectionTitle>
            <ButtonGroup>
              <AddButton onClick={openModal}>추가</AddButton>
              <EditButton onClick={toggleEditMode}>
                {isEditing ? '편집 완료' : '편집'}
              </EditButton>
            </ButtonGroup>
          </SectionTitleWrapper>
          <IngredientTable
            ingredientList={ingredientList}
            isEditing={isEditing} // 편집 상태 전달
            onDeleteIngredient={(ingredientId) => {
              setIngredientList((prevList) =>
                prevList.filter((ingredient) => ingredient.id !== ingredientId)
              );
            }}
            onUpdateIngredient={handleUpdateIngredient} // 재료 수량 업데이트 함수 전달
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
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

const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
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
