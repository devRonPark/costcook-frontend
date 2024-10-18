import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import Layout from '../components/layout/Layout';

const RecipePage = () => (
  <Layout>
    <FilterListContainer>
      <h4>필터 리스트 구현쪽</h4>
    </FilterListContainer>
    <ListRowContainer>
      <List>
        <ReceiptImage>
          <Link to="../recipeDetail">
            <Button>상세페이지</Button>
          </Link>
        </ReceiptImage>
        <TextBox>
          <TitleText>김치볶음밥</TitleText>
          <PriceText>4300원</PriceText>
          <StarText>★★★★☆ 4.0</StarText>
        </TextBox>
      </List>
      <List>
        <ReceiptImage>이미지</ReceiptImage>
        <TextBox>
          <TitleText>김치볶음밥</TitleText>
          <PriceText>4300원</PriceText>
          <StarText>★★★★☆ 4.0</StarText>
        </TextBox>
      </List>
      <List>
        <ReceiptImage>이미지</ReceiptImage>
        <TextBox>
          <TitleText>김치볶음밥</TitleText>
          <PriceText>4300원</PriceText>
          <StarText>★★★★☆ 4.0</StarText>
        </TextBox>
      </List>
    </ListRowContainer>
    <ListRowContainer>
      <List>
        <ReceiptImage>이미지</ReceiptImage>
        <TextBox>
          <TitleText>김치볶음밥</TitleText>
          <PriceText>4300원</PriceText>
          <StarText>★★★★☆ 4.0</StarText>
        </TextBox>
      </List>
      <List>
        <ReceiptImage>이미지</ReceiptImage>
        <TextBox>
          <TitleText>김치볶음밥</TitleText>
          <PriceText>4300원</PriceText>
          <StarText>★★★★☆ 4.0</StarText>
        </TextBox>
      </List>
      <List>
        <ReceiptImage>이미지</ReceiptImage>
        <TextBox>
          <TitleText>김치볶음밥</TitleText>
          <PriceText>4300원</PriceText>
          <StarText>★★★★☆ 4.0</StarText>
        </TextBox>
      </List>
    </ListRowContainer>
    <ListRowContainer>
      <List>
        <ReceiptImage>이미지</ReceiptImage>
        <TextBox>
          <TitleText>김치볶음밥</TitleText>
          <PriceText>4300원</PriceText>
          <StarText>★★★★☆ 4.0</StarText>
        </TextBox>
      </List>
      <List>
        <ReceiptImage>이미지</ReceiptImage>
        <TextBox>
          <TitleText>김치볶음밥</TitleText>
          <PriceText>4300원</PriceText>
          <StarText>★★★★☆ 4.0</StarText>
        </TextBox>
      </List>
      <List>
        <ReceiptImage>이미지</ReceiptImage>
        <TextBox>
          <TitleText>김치볶음밥</TitleText>
          <PriceText>4300원</PriceText>
          <StarText>★★★★☆ 4.0</StarText>
        </TextBox>
      </List>
    </ListRowContainer>
  </Layout>
);

export default RecipePage;

const FilterListContainer = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px black solid;
`;

const ListRowContainer = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border: 1px black solid;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  border: 1px solid black;
  height: 220px;
  width: 120px;
`;

const ReceiptImage = styled.div`
  height: 120px;
  width: 120px;
  border-bottom: 1px black solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3px 5px;
  text-align: left;
`;

const TitleText = styled.h3`
  margin: 3px 0;
`;

const PriceText = styled.a`
  margin: 3px 0;
`;

const StarText = styled.a`
  margin: 3px 0;
`;
