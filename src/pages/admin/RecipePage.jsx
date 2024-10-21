import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentContainer from '../../components/admin/ContentContainer';
import ingredientData from '../../assets/data/ingredients.json';
import IngredientTable from '../../components/admin/IngredientTable';
import ServingsWrapper from '../../components/admin/ServingsWrapper';

const AdminRecipePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); 

  // 상태 : 레시피 이름
  const [recipeName, setRecipeName] = useState('');

  // 상태 : 선택된 메뉴
  const [selectedMenu, setSelectedMenu] = useState(null);

  // 상태 : 식사량 (기본값 1인분)
  const [servings, setServings] = useState(1);

  // 상태 : 재료 리스트 (state에서 재료 리스트를 사용하되, 없으면 기본값 사용)
  const [ingredientList, setIngredientList] = useState(
    state?.ingredientList || 
    ingredientData.slice(0, 3).map((ingredient) => ({
      ...ingredient,
      quantity: 1,
    }))
  );

  // 등록 버튼 활성화 조건
  const isRegisterEnabled = Boolean(recipeName) && ingredientList.length > 0;

  // 페이지 변경 경고 활성화 조건
  const isModified = Boolean(recipeName) || ingredientList.length > 0;

  
  // 페이지 이탈 시 사용자에게 경고 모달을 표시하는 로직
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isModified) {
        event.preventDefault(); 
      }
    };

    // 브라우저에서 페이지 나가기 전 경고 이벤트 추가
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isModified]);


  // 새로고침 감지 후 리프레시 페이지로 리다이렉트하는 로직
  useEffect(() => {
    const handleReload = (event) => {
      if (event.type === 'beforeunload') {
        // 새로고침 시 /admin/refresh로 리다이렉트하며 현재 페이지 정보를 전달
        navigate('/admin/refresh', {
          state: { fromPage: '/admin/recipe' },
        });
      }
    };

    // 새로고침 감지 이벤트 추가
    window.addEventListener('beforeunload', handleReload);

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
      window.removeEventListener('beforeunload', handleReload);
    };
  }, [navigate]);


  // 이벤트 핸들러 : 재료 추가 버튼을 클릭할 때
  const handleAddIngredient = () => {
    navigate('/admin/recipeIngredient', {
      state: { ingredientList, recipeName, servings },
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

  // 이벤트 핸들러 : 체크된 재료들을 리스트에서 지울 때
  const handleDeleteIngredient = (ingredientId) => {
    setIngredientList((prevList) => prevList.filter((ingredient) => ingredient.id !== ingredientId));
  };

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
          <IngredientTable
            ingredientList={ingredientList}
            onDeleteIngredient={handleDeleteIngredient}
          />
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

// 레시피 이름 입력창
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