import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import Layout from '../components/layout/Layout';

const items = [
  {
    receiptImage: '이미지', // 실제 이미지 경로를 넣어도 됩니다.
    title: '김치볶음밥',
    price: 4300,
    rating: '★★★★☆ 4.0',
  },
  {
    receiptImage: '이미지',
    title: '비빔밥',
    price: 5000,
    rating: '★★★★★ 5.0',
  },
  {
    receiptImage: '이미지',
    title: '라면',
    price: 3500,
    rating: '★★★☆☆ 3.0',
  },
  {
    receiptImage: '이미지',
    title: '라면',
    price: 3500,
    rating: '★★★☆☆ 3.0',
  },
  {
    receiptImage: '이미지',
    title: '라면',
    price: 3500,
    rating: '★★★☆☆ 3.0',
  },
  {
    receiptImage: '이미지',
    title: '라면',
    price: 3500,
    rating: '★★★☆☆ 3.0',
  },
  {
    receiptImage: '이미지',
    title: '라면',
    price: 3500,
    rating: '★★★☆☆ 3.0',
  },
  {
    receiptImage: '이미지',
    title: '라면',
    price: 3500,
    rating: '★★★☆☆ 3.0',
  },
  {
    receiptImage: '이미지',
    title: '라면',
    price: 3500,
    rating: '★★★☆☆ 3.0',
  },
];

const RecipePage = () => (
  <Layout>
    <FilterListContainer>
      <h4>필터 리스트 구현쪽</h4>
    </FilterListContainer>
    <ListRowContainer>
      {items.map((item, index) => (
        <Link to="../recipeDetail">
          <Button>
            <List key={index}>
              <ReceiptImage>{item.receiptImage}</ReceiptImage>
              <TextBox>
                <TitleText>{item.title}</TitleText>
                <PriceText>{item.price}원</PriceText>
                <StarText>{item.rating}</StarText>
              </TextBox>
            </List>
          </Button>
        </Link>
      ))}
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
