import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Layout from '../components/layout/Layout';

const RecipeDetail = () => {
  // 활성 탭 상태 관리
  const [activeTabs, setActiveTabs] = useState([
    'ingredients',
    'cookingMethod',
    'recipeEvaluation',
    'review',
  ]); // 초기값은 전부다 열려있는 상태

  const reviewRef = useRef(null); // 리뷰 컨테이너의 ref 생성

  // 탭 클릭 핸들러
  const handleTabClick = (tab) => {
    setActiveTabs((prev) =>
      prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab]
    ); // 탭을 토글
  };

  // "리뷰보기" 클릭 시 스크롤 핸들러
  const scrollToReview = () => {
    if (!activeTabs.includes('review')) {
      setActiveTabs((prev) => [...prev, 'review']); // 리뷰 탭 열기
    }
    reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Layout>
      <ReceiptImage>이미지</ReceiptImage>
      <RatingContainer>
        <RatingSubContainer>★★★★★</RatingSubContainer>
        <RatingSubContainer text="center">평점 5.0</RatingSubContainer>
        {/* "리뷰보기" 버튼 클릭 시 스크롤 이동 */}
        <RatingSubContainer text="flex-end" onClick={scrollToReview}>
          리뷰보기
        </RatingSubContainer>
      </RatingContainer>
      <TabListContainer>
        <TabList onClick={() => handleTabClick('ingredients')}>
          레시피 재료{' '}
          {activeTabs.includes('ingredients') ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </TabList>
        {activeTabs.includes('ingredients') && (
          <TabContent>재료 내용</TabContent>
        )}

        <TabList onClick={() => handleTabClick('cookingMethod')}>
          레시피 조리방법{' '}
          {activeTabs.includes('cookingMethod') ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </TabList>
        {activeTabs.includes('cookingMethod') && (
          <TabContent>조리방법 내용</TabContent>
        )}

        <TabList onClick={() => handleTabClick('recipeEvaluation')}>
          레시피 평가하기{' '}
          {activeTabs.includes('recipeEvaluation') ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </TabList>
        {activeTabs.includes('recipeEvaluation') && (
          <TabContent>평가하기</TabContent>
        )}

        <TabList onClick={() => handleTabClick('review')}>
          레시피 리뷰{' '}
          {activeTabs.includes('review') ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </TabList>
        {/* 리뷰 컨텐츠에 ref 연결  */}
        {activeTabs.includes('review') && (
          <TabContent ref={reviewRef}>
            <ReviewContainer>
              <ReviewImage>이미지</ReviewImage>
              <ReviewTextContainer>
                <TitleText>작성자</TitleText>
                <StarText>★★★★★</StarText>
                <ContentText>항상 이 레시피를 애용해요</ContentText>
              </ReviewTextContainer>
            </ReviewContainer>
            <ReviewContainer>리뷰내용</ReviewContainer>
            <ReviewContainer>리뷰내용</ReviewContainer>
          </TabContent>
        )}
      </TabListContainer>
    </Layout>
  );
};

export default RecipeDetail;

const ReceiptImage = styled.div`
  height: 300px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RatingContainer = styled.div`
  height: 50px;
  width: 100%;
  margin: 20px 0px;
  border-bottom: 1px black solid;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const RatingSubContainer = styled.div`
  height: 50px;
  width: 30%;
  border: 1px black solid;
  display: flex; /* Flexbox 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: ${(props) =>
    props.text || 'flex-start'}; /* 기본값은 'flex-start'로 설정 */
`;

const TabListContainer = styled.div`
  width: 100%;
  border: 1px black solid;
`;

const TabList = styled.div`
  width: 100%;
  height: 50px;
  margin: 10px 0px;
  border: 1px black solid;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center; /* 아이콘과 텍스트 세로 중앙 정렬 */
  cursor: pointer; /* 클릭 가능하게 변경 */
`;

const TabContent = styled.div`
  width: 100%;
  min-height: 200px;
  margin: 10px 0px;
  border: 1px black solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ReviewContainer = styled.div`
  width: 90%;
  height: 100px;
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  margin-top: 10px;
`;

const ReviewTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReviewImage = styled.div`
  height: 100px;
  width: 100px;
  border-right: 1px black solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.h3`
  margin: 3px 0 0 0;
`;

const ContentText = styled.a`
  margin: 3px 0;
`;

const StarText = styled.a`
  font-size: 13px;
`;
