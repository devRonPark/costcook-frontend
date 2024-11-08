import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import styled from 'styled-components';
import apiClient from '../services/api';

const RecipeInstructions = ({ rcpSno }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(
          `${import.meta.env.VITE_REST_SERVER}/recipes/test?number=${rcpSno}`
        ); // 만개의 레시피 API 엔드포인트
        console.log(response);
        const data = response.data; // HTML 형식으로 응답을 받는 경우

        // DOMPurify로 HTML을 안전하게 정화
        const sanitizedContent = DOMPurify.sanitize(data);

        setContent(sanitizedContent); // 정화된 HTML을 상태로 설정
      } catch (error) {
        console.error('API 호출 오류:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <RecipeInstructionsContainer>
      {/* 정화된 HTML을 dangerouslySetInnerHTML로 안전하게 렌더링 */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </RecipeInstructionsContainer>
  );
};

export default RecipeInstructions;

export const RecipeInstructionsContainer = styled.div`
  list-style: none;

  li {
    display: flex;
    margin-top: 5px;
    margin-bottom: 5px;
    justify-content: space-between;
  }

  .step_list_num {
    flex: 0 0 10%;
    font-weight: bold;
    font-family: 'GangwonEduPowerExtraBoldA';
  }

  .step_list_txt_cont {
    line-height: 1.5;
    font-family: 'STUNNING-Bd';
    flex: 0 0 60%;
    font-size: 14px;
  }

  a {
    display: none;
  }

  .step_list_txt_pic {
    margin-left: auto;
    flex: 0 0 30%;
    display: flex;
    margin-bottom: 20px;
    border-radius: 8px;
    background-color: #f9f9f9;
  }

  img {
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 5px;
  }
`;
