import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import apiClient from '../../services/api';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentContainer from '../../components/admin/ContentContainer';
import menuData from '../../assets/data/menus.json'; 
import IngredientTable from '../../components/admin/IngredientTable';
import RecipeIngredientPage from './RecipeIngredientPage';
import SelectWrapper from '../../components/admin/SelectWrapper';
import ThumbnailUploader from '../../components/ThumbnailUploader';
import DuplicateContainer from '../../components/admin/DuplicateContainer';

const BASE_SERVER_URL = import.meta.env.VITE_BASE_SERVER_URL;

const AdminRecipeForm = () => {

  // 다른 페이지로 이동하기 위한 함수
  const navigate = useNavigate();
  // 현재 위치 정보를 가져오기 위한 훅
  const location = useLocation();
  // 이전 페이지에서 전달된 레시피 정보 (편집 모드일 경우에만 존재)
  const editingRecipe = location.state?.recipe;
  // true이면 편집 모드, false이면 추가 모드
  const isEditingRecipe = !!editingRecipe;


  // [1] 초기 상태

  const initialState = {
    // title(이름), rcpSno(만개 번호), desciption(설명), servings(설명)
    // categoryId(카테고리 번호), price(총 비용), ingredients(재료 리스트)
    // thumbnailFile(썸네일 객체), thumbnailUrl(썸네일 경로), thumbnailDeleted(현재 썸네일이 삭제?)
    title: editingRecipe?.title || '', 
    rcpSno: editingRecipe?.rcpSno || '', 
    description: editingRecipe?.description || '',
    servings: editingRecipe?.servings || 1,
    categoryId: editingRecipe?.category?.id || 1,
    price: editingRecipe?.price || 0,
    ingredients: [],
    thumbnailFile: null,
    thumbnailUrl: editingRecipe?.thumbnailUrl ? BASE_SERVER_URL + editingRecipe.thumbnailUrl : null,
    thumbnailDeleted: false,
  };


  // [2] 상태 관리
  
  const [currentState, setCurrentState] = useState(initialState);
  const [isTitleUnique, setIsTitleUnique] = useState(isEditingRecipe);
  const [isEditingIngredients, setIsEditingIngredients] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (key, value) => {
    setCurrentState((prevState) => ({ ...prevState, [key]: value, }));
  };

  const handleRcpSnoChange = (value) => {
    // 만개 번호는 유효성 검사를 수행함.
    if (value === '' || (Number.isInteger(Number(value)) && Number(value) > 0)) {
      handleInputChange('rcpSno', value === '' ? '' : String(Number(value)));
    } else {
      alert("고유번호는 자연수여야 합니다.");
    }
  };

  const updateTotalCost = () => {
    const totalCost = currentState.ingredients.reduce((acc, ingredient) => {
      const ingredientPrice = Number(ingredient.pricePerUnit) || 0;   
      const quantity = Number(ingredient.quantity) || 0; 
      return acc + (ingredientPrice * quantity);
    }, 0);

    handleInputChange("price", totalCost); 
  };
  
  const handleUpdateIngredient = (ingredientId, newQuantity) => {
    // ingredients 배열을 순회하면서 특정 ingredientId와 일치하는 재료를 찾음.
    // 일치하는 재료의 quantity를 newQuantity로 업데이트하여 새로운 배열을 생성함.
    const updatedList = currentState.ingredients.map((ingredient) =>
      ingredient.id === ingredientId ? { ...ingredient, quantity: newQuantity } : ingredient
    );
    // 변경된 재료 리스트를 상태에 반영
    handleInputChange('ingredients', updatedList);
  };

  const handleDeleteIngredient = (ingredientId) => {
    // ingredients 배열을 순회하여 특정 ingredientId와 일치하지 않는 재료만 남기고 필터링
    const updatedList = currentState.ingredients.filter(
      (ingredient) => ingredient.id !== ingredientId
    );
    // 변경된 재료 리스트를 상태에 반영
    handleInputChange('ingredients', updatedList);
  };

  const handleCheckDuplicate = (recipeTitle, isDuplicate) => {
    if (!isDuplicate) {
      handleInputChange('title', recipeTitle);
      setIsTitleUnique(true);
    } else {
      alert('이미 존재하는 레시피입니다. 다른 이름을 입력해주세요.');
      handleInputChange('title', '');
      setIsTitleUnique(false);
    }
  };


  // [3] 해당 레시피의 재료 리스트를 가져오는 로직

  const fetchIngredients = async () => {
    try {
      const response = await apiClient.get(`/admin/recipes/${editingRecipe.id}/ingredients`);
      if (response.status === 200) {
        const formattedIngredients = response.data.map((ingredient) => ({
          ...ingredient, id: ingredient.ingredientId,
        }));
        handleInputChange('ingredients', formattedIngredients);
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


  // [4] FormData를 생성하는 로직

  const getChangedFields = () => {
    // 변경된 필드들을 저장할 객체
    const changedFields = {};
  
    // currentState의 필드들을 순회하여 초기 상태와 현재 상태의 값이 다른지 확인함.
    // 둘이 다르면 changedFields 객체에 해당 필드를 추가함.
    Object.keys(currentState).forEach((key) => {
      if (initialState[key] !== currentState[key]) {
        changedFields[key] = currentState[key];
      }
    });
  
    return changedFields;
  };

  const createFormData = () => {
    const formData = new FormData();
  
    // 수정 모드일 때 변경된 데이터만 사용, 추가 모드에서는 전체 사용
    const formFields = isEditingRecipe ? getChangedFields() : currentState;
  
    formFields.ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}].ingredientId`, ingredient.id);
      formData.append(`ingredients[${index}].quantity`, ingredient.quantity);
    });
  
    // 다른 필드들도 FormData에 추가함
    Object.entries(formFields).forEach(([key, value]) => {
      // `ingredients` 필드는 이미 추가했으므로 제외
      if (key !== "ingredients") {
        formData.append(key, value);
      }
    });
  
    return formData;
  };

  
  // [5] FormData를 전송하는 로직

  const handleSubmit = async () => {
    // 서버에 전송할 FormData 객체를 생성함.
    const formData = createFormData();

    // 모드에 따라 API URL, HTTP 메서드, 성공 메시지를 설정함.
    const [url, method] = isEditingRecipe
      ? [`/admin/recipes/${editingRecipe.id}`, 'patch']
      : ['/admin/recipes', 'post'];

    const [successMessage, errorMessage] = isEditingRecipe
      ? ['레시피가 수정되었습니다.', '레시피 수정에 실패했습니다.']
      : ['레시피가 등록되었습니다.', '레시피 등록에 실패했습니다.']
  
    try {
      // 설정된 URL과 메서드로 API 요청을 전송함.
      const response = await apiClient[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      // 요청 성공 시 레시피 목록 페이지로 이동함.
      if (response.status === 200) {
        toast.info(successMessage);
        navigate("/admin/recipe-list");
      }
    } catch (error) {
      console.error('서버 통신 에러:', error);
      toast.error(errorMessage);
    }
  };
  

  // [6] 썸네일 이미지를 처리하는 로직

  const handleImageUpload = (file) => {
    const fileUrl = URL.createObjectURL(file);
    handleInputChange('thumbnailFile', file);  // 썸네일 객체 설정
    handleInputChange('thumbnailUrl', fileUrl);  // 썸네일 경로 설정
    handleInputChange('thumbnailDeleted', false);  // 썸네일 추가 시 false 설정
  };
  
  const handleImageRemove = () => {
    handleInputChange('thumbnailFile', null);
    handleInputChange('thumbnailUrl', null);
    handleInputChange('thumbnailDeleted', true);  // 썸네일 삭제 시 true 설정
  };


  // [7] 재료 리스트 관련 모달을 처리하는 로직

  const openModal = () => {
    setIsModalOpen(true);
    setIsEditingIngredients(false);
  };

  const closeModal = () => setIsModalOpen(false);

  const toggleIngredientEditMode = () => setIsEditingIngredients((prev) => !prev);


  // [8] 조건 설정 

  const isRegisterEnabled = Boolean(isTitleUnique) && currentState.ingredients.length > 0 && currentState.rcpSno !== '';
  const isModified = Boolean(currentState.title) || currentState.ingredients.length > 0 || Boolean(currentState.thumbnailFile) || currentState.rcpSno !== '';


  // 렌더링
  return (
    <AdminLayout
      title="레시피"
      rightLabel={isEditingRecipe ? '수정' : '등록'}
      isRegisterEnabled={isRegisterEnabled} 
      isModified={isModified}  
      onSubmit={handleSubmit} 
      onBack={() => navigate("/admin/recipe-list")}
    >
      <ContentContainer>
        {/* 레시피 이름 입력 섹션 */}
        <Section>
          <SectionTitle>레시피 이름</SectionTitle>
          <DuplicateContainer
            apiEndpoint="/admin/recipes/duplicate"
            queryParamName="recipeTitle"
            placeholder="레시피 이름을 입력하세요"
            onCheckDuplicate={handleCheckDuplicate}
            isEditing={isEditingRecipe}
            defaultValue={editingRecipe?.title || ''}
          />
        </Section>

        <Section>
          <SectionTitle>만개 레시피 고유번호</SectionTitle>
          <StyledInput
              type="number"
              placeholder="레시피 고유번호"
              value={currentState.rcpSno}
              onChange={(e) => handleRcpSnoChange(e.target.value)}
              disabled={isEditingRecipe}
              style={{ backgroundColor: isEditingRecipe ? '#f0f0f0' : 'white' }}
          />
        </Section>

        <Section>
          <SectionTitle>레시피 설명</SectionTitle>
          <StyledTextarea
              placeholder="레시피 설명을 입력하세요"
              value={currentState.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </Section>

        {/* 레시피 카테고리 설정 섹션 */}
        <Section>
          <SectionTitle>레시피 카테고리</SectionTitle>
          <SelectWrapper
            value={currentState.categoryId}
            onChange={(e) => handleInputChange("categoryId", Number(e.target.value))}
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
            value={currentState.servings}
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
              {currentState.ingredients.length > 0 && (
                <EditButton onClick={toggleIngredientEditMode}>
                  {isEditingIngredients ? '편집 완료' : '편집'}
                </EditButton>
              )}
            </ButtonGroup>
          </SectionTitleWrapper>
          <IngredientTable
            ingredientList={currentState.ingredients}
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
            imageUrl={currentState.thumbnailUrl}
          />
        </Section>

        {/* RecipeIngredientPage 컴포넌트를 렌더링 */}
        {isModalOpen && (
          <ModalWrapper>
           <RecipeIngredientPage
            ingredientList={currentState.ingredients} 
            setIngredientList={(newIngredients) => handleInputChange("ingredients", newIngredients)}
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

const StyledTextarea = styled.textarea`
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
    min-height: 100px;
    box-sizing: border-box;
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