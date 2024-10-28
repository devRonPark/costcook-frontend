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

const AdminRecipeForm = () => {

  const navigate = useNavigate();
  const location = useLocation();

  // 현재 편집 중인 레시피 정보를 location에서 가져옴
  const editingRecipe = location.state?.recipe; 

  // 상태 초기화
  const initializeState = () => ({
    recipeName: editingRecipe?.title || '', // 편집 중인 레시피의 제목, 없으면 빈 문자열
    servings: editingRecipe?.servings || 1, // 편집 중인 레시피의 인분 수, 없으면 1
    selectedCategory: editingRecipe?.category?.id || 1, // 편집 중인 카테고리 ID, 없으면 1
    ingredientList: [], // 초기 재료 목록
    thumbnailFile: null, // 썸네일 파일 상태
    thumbnailUrl: editingRecipe?.thumbnailUrl || null, // 편집 중인 썸네일 URL, 없으면 null
    totalCost: editingRecipe?.price || 0, // 편집 중인 가격, 없으면 0
  });

  const [state, setState] = useState(initializeState); // 상태 초기화
  const [isEditingRecipe, setIsEditingRecipe] = useState(!!editingRecipe); // 레시피 편집 모드 여부
  const [isEditingIngredients, setIsEditingIngredients] = useState(false); // 재료 테이블 편집 모드 여부
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태

  // 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
    setIsEditingIngredients(false); // 모달을 열 때 재료 테이블 편집 상태를 해제
  };

  // 모달 닫기
  const closeModal = () => setIsModalOpen(false);

  // 재료 테이블 편집 모드 변경 핸들러
  const toggleIngredientEditMode = () => setIsEditingIngredients((prev) => !prev);

  const { recipeName, servings, selectedCategory, ingredientList, thumbnailFile, thumbnailUrl, totalCost } = state;

  // 편집 화면으로 들어오는 재료 리스트 가져오기
  const fetchIngredients = async () => {
    try {
      const response = await apiClient.get(`/admin/recipes/${editingRecipe.id}/ingredients`);
      if (response.status === 200) {
        const formattedIngredients = response.data.map((ingredient) => ({
          ...ingredient,
          id: ingredient.ingredientId, // ingredientId를 id로 매핑
        }));
        setState((prevState) => ({
          ...prevState,
          ingredientList: formattedIngredients, // 서버에서 가져온 재료 리스트로 업데이트
        }));
      }
    } catch (error) {
      console.error('재료 리스트 가져오기 실패 : ', error);
    }
  };

  useEffect(() => {
    if(isEditingRecipe) fetchIngredients();
  }, []);


  // 등록 버튼 활성화 조건
  const isRegisterEnabled = Boolean(recipeName) && ingredientList.length > 0;

  // 페이지 변경 경고 활성화 조건
  const isModified = Boolean(recipeName) || ingredientList.length > 0 || Boolean(thumbnailFile);

  // 서버로 등록 요청
  const handleSubmit = async () => {
    // DB 등록시 가격을 식사량으로 나눠야 함. 1인분 기준
    try {
      // FormData 생성
      const formData = new FormData();

      // 레시피 정보 JSON 데이터 추가 (Blob으로 변환)
      const recipeData = {
        title: recipeName,
        categoryId: selectedCategory,
        servings: servings,
        description: '설명',
        ingredients: ingredientList.map(ingredient => ({
          ingredientId: ingredient.id,
          quantity: ingredient.quantity,
        })),
        price: totalCost,
      };
      formData.append('recipe', new Blob([JSON.stringify(recipeData)], { type: 'application/json' }));

      // 썸네일 파일 추가
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      // 서버로 요청 전송
      const response = await apiClient.post('/admin/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert(response.data);
      } else {
        alert(response.data);
      }
    } catch (error) {
      console.error('서버 통신 에러:', error);
      alert('서버 통신 중 오류가 발생했습니다.');
    }

    navigate("/admin/recipe-list");
  };

  // 재료 수량 업데이트 함수
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
  
  // onDeleteIngredient, onUpdateIngredient 함수를 가독성 있게 분리
  const handleDeleteIngredient = (ingredientId) => {
    const updatedList = state.ingredientList.filter(
      (ingredient) => ingredient.id !== ingredientId
    );
    updateIngredientList(updatedList);
  };
  
  const handleUpdateIngredient = (ingredientId, newQuantity) => {
    console.log("재료 : " + ingredientId);
    const updatedList = state.ingredientList.map((ingredient) =>
      ingredient.id === ingredientId
        ? { ...ingredient, quantity: newQuantity }
        : ingredient
    );
    updateIngredientList(updatedList);
  };


  const handleImageUpload = (file) => {
    setThumbnailFile(file);
    // 파일을 서버로 보내거나 다른 작업을 수행할 수 있음
    console.log('Uploaded file:', file);
  };

  // 편집 모드 변경 핸들러
  const toggleEditMode = () => setIsEditing((prev) => !prev);

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
            onChange={(e) => setRecipeName(e.target.value)}
          />
        </Section>

        {/* 레시피 카테고리 설정 섹션 */}
        <Section>
          <SectionTitle>레시피 카테고리</SectionTitle>
          <SelectWrapper value={selectedCategory} onChange={(e) => setSelectedCategory(Number(e.target.value))}>
            {menuData.map((menu) => ( // menuData는 그대로 사용
              <option key={menu.id} value={menu.id}>
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
          <h2>레시피 썸네일</h2>
          <ThumbnailUploader onImageUpload={handleImageUpload} />
          {/* 추가적인 레시피 입력 폼 */}
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