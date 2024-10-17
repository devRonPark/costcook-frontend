import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentContainer from '../../components/admin/ContentContainer';
import ingredientData from '../../assets/data/ingredients.json';
import IngredientTable from '../../components/admin/IngredientTable'; 
import ServingsWrapper from '../../components/admin/ServingsWrapper';

const AdminRecipePage = () => {
  const [recipeName, setRecipeName] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [servings, setServings] = useState(1); // 식사량
  const [ingredientList, setIngredientList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // 1번부터 3번까지의 재료를 기본적으로 1개씩 추가
    const defaultIngredientList = ingredientData.slice(0, 3).map((ingredient) => ({
      ...ingredient,
      quantity: 1, // 기본 수량 1개로 설정
    }));
    setIngredientList(defaultIngredientList);
  }, []);

  const handleNameChange = (e) => {
    setRecipeName(e.target.value);
  };

  const handleMenuSelect = (menu) => {
    setSelectedMenu(selectedMenu === menu.id ? null : menu.id);
  };

  const handleServingsSelect = (e) => {
    setServings(Number(e.target.value));
  };

  const handleAddIngredient = () => {
    navigate('/admin/recipeIngredient');
  };

  // "등록" 버튼 활성화 여부 결정
  const isRegisterEnabled = Boolean(recipeName) && selectedMenu !== null;

  // "나가기" 확인 모달 활성화 여부 결정
  const isModified = Boolean(recipeName) || selectedMenu !== null;

  // 서버로 등록 요청
  const onSubmit = async () => {
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
      alert(`API: /api/admin/recipes\n\n데이터: ${JSON.stringify(
        {
          recipeName,
          categoryId: selectedMenu,
        }, null, 2 )}`
      );
    }
  };

  return (
    <AdminLayout
      title="레시피"
      rightLabel="등록"
      isRegisterEnabled={isRegisterEnabled}
      isModified={isModified} // 입력값 변경 여부 전달
      onSubmit={onSubmit} // 등록 함수 전달
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

// 스타일 컴포넌트 정의
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
