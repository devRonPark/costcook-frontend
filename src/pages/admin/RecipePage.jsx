import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentContainer from '../../components/admin/ContentContainer';
import ingredientData from '../../assets/data/ingredients.json';
import IngredientTable from '../../components/admin/IngredientTable';
import ServingsWrapper from '../../components/admin/ServingsWrapper';
import ContentContainer from '../../components/admin/ContentContainer';

const AdminRecipePage = () => {

  const navigate = useNavigate();
  const { state } = useLocation(); 

  // 상태 : 레시피 이름
  const [recipeName, setRecipeName] = useState('');

  // 상태 : 선택된 메뉴
  const [selectedMenu, setSelectedMenu] = useState(null);

  // 상태 : 식사량 (기본값 1인분)
  const [servings, setServings] = useState(1);

  // 상태 : 재료 리스트
  // 다른 페이지에서 전달된 재료 리스트가 있으면 그 리스트를 사용하고, 없으면 빈 리스트로 초기화
  const [ingredientList, setIngredientList] = useState(state?.ingredientList || []);

  // 전달된 state에 재료 리스트가 있는 경우 이를 ingredientList로 설정함
  useEffect(() => {
    if (state?.ingredientList) {
      setIngredientList(state.ingredientList);
    }
  }, [state]);

  // 재료 리스트가 비어 있을 경우 기본 재료(간장, 감자, 계란)를 3개 추가함 
  // 각각 1인분
  useEffect(() => {
    if (ingredientList.length === 0) {
      const defaultIngredientList = ingredientData.slice(0, 3).map((ingredient) => ({
        ...ingredient, quantity: 1, 
      }));
      setIngredientList(defaultIngredientList);
    }
  }, []);

  // 이벤트 헨들러 : 재료 추가 버튼을 클릭할 때
  const handleAddIngredient = () => {
    // 재료 추가 페이지에 기존 재료 리스트를 전달함
    navigate('/admin/recipeIngredient', {
      state: { ingredientList }
    });
  };

  // 이벤트 핸들러 : 레시피 이름이 변경될 때마다
  const handleNameChange = (e) => {
    setRecipeName(e.target.value);
  };

  // 이벤트 핸들러 : 메뉴를 선택할 때마다
  const handleMenuSelect = (menu) => {
    setSelectedMenu(selectedMenu === menu.id ? null : menu.id);
  };

  // 이벤트 핸들러 : 식사량을 선택할 때마다
  const handleServingsSelect = (e) => {
    setServings(Number(e.target.value));
  };

  // 등록 버튼을 활성화해야 하는지
  const isRegisterEnabled = Boolean(recipeName) && selectedMenu !== null && ingredientList.length > 0;;

  // Exit 모달을 활성화해야 하는지
  const isModified = Boolean(recipeName) || selectedMenu !== null || ingredientList.length > 0;;

  // 서버로 등록 요청
  const handleSubmit = async () => {
    try {
      const requestData = {
        recipeName,
        categoryId: selectedMenu,
      };

      const response = await axios.post('/api/admin/recipes', requestData);

      if (response.status === 200) {
        alert('레시피가 성공적으로 등록되었습니다!');
      } else {
        alert('등록에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('서버 통신 에러:', error);
      alert(
        `API: /api/admin/recipes\n\n데이터: ${JSON.stringify(
          {
            recipeName,
            categoryId: selectedMenu,
          },
          null,
          2
        )}`
      );
    }
  };

  return (
    <AdminLayout
      title="레시피"
      rightLabel="등록"
      isRegisterEnabled={isRegisterEnabled}
      isModified={isModified}
      onSubmit={handleSubmit}
    >
      <ContentContainer>
        <Section>
          <SectionTitle>레시피 이름</SectionTitle>
          <StyledInput
            type="text"
            placeholder="레시피 이름을 입력하세요"
            value={recipeName}
            onChange={handleNameChange}
          />
        </Section>

        <Section>
          <SectionTitle>레시피 식사량</SectionTitle>
          <ServingsWrapper value={servings} onChange={handleServingsSelect} />
        </Section>

        <Section>
          <SectionTitleWrapper>
            <SectionTitle>레시피 재료</SectionTitle>
            <AddButton onClick={handleAddIngredient}>추가</AddButton>
          </SectionTitleWrapper>
          <IngredientTable ingredientList={ingredientList} />
        </Section>
      </ContentContainer>
    </AdminLayout>
  );
};

export default AdminRecipePage;

// 전체 영역
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

// 재료 추가 버튼
const AddButton = styled.button`
  background-color: #17c3b2; /* 민트색 */
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #14a699; /* 약간 어두운 민트색 */
  }
`;

// 레시피 이름 입력창
const StyledInput = styled.input`
  width: 100%;
  height: 48px; /* 높이 고정 */
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;

  &::placeholder {
    color: #aaa;
  }
`;
