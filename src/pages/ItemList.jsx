import styled from 'styled-components';

import Layout from '../components/layout/Layout';

const ItemList = () => {
  return (
    <Layout>
      <DateContainer>
        <DateListContainer>
          <DateBoxContainer>
            <DateImageContainer>이미지</DateImageContainer>
            가공식품류
          </DateBoxContainer>
          <DateBoxContainer>
            <DateImageContainer>이미지</DateImageContainer>
            건어물류
          </DateBoxContainer>
          <DateBoxContainer>
            <DateImageContainer>이미지</DateImageContainer>
            과일류
          </DateBoxContainer>
        </DateListContainer>
        <DateListContainer>
          <DateBoxContainer>
            <DateImageContainer>이미지</DateImageContainer>
            달걀/유제품
          </DateBoxContainer>
          <DateBoxContainer>
            <DateImageContainer>이미지</DateImageContainer>
            닭고기
          </DateBoxContainer>
          <DateBoxContainer>
            <DateImageContainer>이미지</DateImageContainer>
            돼지고기
          </DateBoxContainer>
        </DateListContainer>
        <DateListContainer>
          <DateBoxContainer>
            <DateImageContainer>이미지</DateImageContainer>
            소고기
          </DateBoxContainer>
          <DateBoxContainer>
            <DateImageContainer>이미지</DateImageContainer>
            밀가루
          </DateBoxContainer>
          <DateBoxContainer>
            <DateImageContainer>이미지</DateImageContainer>
            버섯류
          </DateBoxContainer>
        </DateListContainer>
      </DateContainer>

      <TextContainer>다음 버튼</TextContainer>
    </Layout>
  );
};

export default ItemList;

const TextContainer = styled.div`
  height: 100px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
`;
const DateContainer = styled.div`
  height: 670px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
`;

const DateListContainer = styled.div`
  height: 320px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
`;
const DateBoxContainer = styled.div`
  height: 180px;
  width: 28%;
  border: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

const DateImageContainer = styled.div`
  height: 120px;
  width: 90%;
  border: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;
