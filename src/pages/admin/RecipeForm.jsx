import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentContainer from '../../components/admin/ContentContainer';
import menuData from '../../assets/data/menus.json'; 
import IngredientTable from '../../components/admin/IngredientTable';
import RecipeIngredientPage from './RecipeIngredientPage';
import SelectWrapper from '../../components/admin/SelectWrapper';
import ThumbnailUploader from '../../components/ThumbnailUploader';
import styled from 'styled-components';
import apiClient from '../../services/api';

const BASE_SERVER_URL = import.meta.env.VITE_BASE_SERVER_URL;

const AdminRecipeForm = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const editingRecipe = location.state?.recipe;

  // 상태 초기화
  const initializeState = () => ({
    recipeName: editingRecipe?.title || '',
    servings: editingRecipe?.servings || 1,
    selectedCategory: editingRecipe?.category?.id || 1,
    ingredientList: [],
    thumbnailFile: null,
    thumbnailUrl: editingRecipe?.thumbnailUrl ? BASE_SERVER_URL + editingRecipe.thumbnailUrl : null,
    totalCost: editingRecipe?.price || 0,
  });

  // 상태 변수
  const [state, setState] = useState(initializeState);
  const [isEditingRecipe, setIsEditingRecipe] = useState(!!editingRecipe);
  const [isEditingIngredients, setIsEditingIngredients] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { recipeName, servings, selectedCategory, ingredientList, thumbnailFile, totalCost } = state;

  // 상태 변경 함수
  const handleInputChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const updateIngredientList = (updatedList) => {
    setState((prevState) => ({
      ...prevState,
      ingredientList: updatedList,
    }));
  };

  const updateTotalCost = (newTotalCost) => {
    setState((prevState) => ({
      ...prevState,
      totalCost: newTotalCost,
    }));
  };

  // 이벤트 핸들러
  const handleDeleteIngredient = (ingredientId) => {
    const updatedList = state.ingredientList.filter(
      (ingredient) => ingredient.id !== ingredientId
    );
    updateIngredientList(updatedList);
  };

  const handleUpdateIngredient = (ingredientId, newQuantity) => {
    const updatedList = state.ingredientList.map((ingredient) =>
      ingredient.id === ingredientId
        ? { ...ingredient, quantity: newQuantity }
        : ingredient
    );
    updateIngredientList(updatedList);
  };

  const handleImageUpload = (file) => {
    const fileUrl = URL.createObjectURL(file);
    handleInputChange('thumbnailFile', file);
    handleInputChange('thumbnailUrl', fileUrl);
  };

  const handleImageRemove = () => {
    handleInputChange('thumbnailFile', null);
    handleInputChange('thumbnailUrl', null);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsEditingIngredients(false);
  };

  const closeModal = () => setIsModalOpen(false);

  const toggleIngredientEditMode = () => setIsEditingIngredients((prev) => !prev);

  // 데이터 가져오기
  const fetchIngredients = async () => {
    try {
      const response = await apiClient.get(`/admin/recipes/${editingRecipe.id}/ingredients`);
      if (response.status === 200) {
        const formattedIngredients = response.data.map((ingredient) => ({
          ...ingredient,
          id: ingredient.ingredientId,
        }));
        updateIngredientList(formattedIngredients);
      }
    } catch (error) {
      console.error('재료 리스트 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    if (isEditingRecipe) {
      fetchIngredients();
    }
  }, []);

  // 데이터 전송하기
  // 서버에 레시피 데이터를 제출하는 함수
  const handleSubmit = async () => {
    try {
      const formData = createFormData();
      const response = await submitRecipeData(formData);

      if (response.status === 200) {
        alert(isEditingRecipe ? '레시피가 수정되었습니다.' : '레시피가 등록되었습니다.');
        navigate("/admin/recipe-list");
      }
    } catch (error) {
      console.error('서버 통신 에러:', error);
      alert('서버 통신 중 오류가 발생했습니다.');
    }
  };

  // FormData 생성 함수
  const createFormData = () => {
    const formData = new FormData();
    const recipeData = {
      title: recipeName,
      categoryId: selectedCategory,
      servings,
      description: '설명',
      ingredients: ingredientList.map(ingredient => ({
        ingredientId: ingredient.id,
        quantity: ingredient.quantity,
      })),
      price: totalCost,
    };

    formData.append('recipe', new Blob([JSON.stringify(recipeData)], { type: 'application/json' }));
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    return formData;
  };

  // 레시피 데이터를 서버로 전송하는 함수
  const submitRecipeData = async (formData) => {
    const url = isEditingRecipe ? `/admin/recipes/${editingRecipe.id}` : '/admin/recipes';
    const method = isEditingRecipe ? 'patch' : 'post';

    return apiClient[method](url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };


  // 조건 설정
  const isRegisterEnabled = Boolean(recipeName) && ingredientList.length > 0;
  const isModified = Boolean(recipeName) || ingredientList.length > 0 || Boolean(thumbnailFile);

  // 렌더링
  return (
    <AdminLayout
      title="레시피"
      rightLabel={isEditingRecipe ? '수정' : '등록'}
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
            onChange={(e) => handleInputChange("recipeName", e.target.value)}
            disabled={isEditingRecipe} // 편집 중일 때 입력 비활성화
            style={{ backgroundColor: isEditingRecipe ? '#f0f0f0' : 'white' }} // 회색 배경 설정
          />
        </Section>

        {/* 레시피 카테고리 설정 섹션 */}
        <Section>
          <SectionTitle>레시피 카테고리</SectionTitle>
          <SelectWrapper
            value={selectedCategory}
            onChange={(e) => handleInputChange("selectedCategory", Number(e.target.value))}
          >
            {menuData.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.name}
              </option>
            ))}
          </SelectWrapper>
        </Section>

        {/* 레시피 식사량 설정 섹션 */}
        <Section>
          <SectionTitle>레시피 식사량</SectionTitle>
          <SelectWrapper
            value={servings}
            onChange={(e) => handleInputChange("servings", Number(e.target.value))}
          >
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
              {ingredientList.length > 0 && (
                <EditButton onClick={toggleIngredientEditMode}>
                  {isEditingIngredients ? '편집 완료' : '편집'}
                </EditButton>
              )}
            </ButtonGroup>
          </SectionTitleWrapper>
          <IngredientTable
            ingredientList={state.ingredientList}
            isEditing={isEditingIngredients}
            onDeleteIngredient={handleDeleteIngredient}
            onUpdateIngredient={handleUpdateIngredient}
            onTotalCostChange={updateTotalCost}
          />
        </Section>

        <Section>
          <SectionTitle>레시피 썸네일</SectionTitle>
          <ThumbnailUploader 
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            imageUrl={state.thumbnailUrl}
          />
        </Section>

        {/* RecipeIngredientPage 컴포넌트를 렌더링 */}
        {isModalOpen && (
          <ModalWrapper>
           <RecipeIngredientPage
            ingredientList={state.ingredientList} // state에서 ingredientList를 가져옴
            setIngredientList={(newIngredientList) => {
              setState({
                ...state,
                ingredientList: newIngredientList, // 새로운 재료 목록으로 업데이트
              });
            }}
            onClose={closeModal}
          />
          </ModalWrapper>
        )}
      </ContentContainer>
    </AdminLayout>
  );
};

export default AdminRecipeForm;

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