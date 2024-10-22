import styled from 'styled-components';
import Layout from '../components/layout/Layout';

const Activities = () => {
  return (
    <Layout>
      <DataContainer>
        <DataGraphContainer>그래프</DataGraphContainer>
        <DataItemContainer>
          <DataItemTextContainer>
            지난주보다 40000원 아끼는중 !
          </DataItemTextContainer>
          <DataItemImageContainer>
            <DataItems>
              <DataItemImage>이미지</DataItemImage>
              <DataItemText>텍스트</DataItemText>
            </DataItems>
            <DataItems>
              <DataItemImage>이미지</DataItemImage>
              <DataItemText>텍스트</DataItemText>
            </DataItems>
          </DataItemImageContainer>
        </DataItemContainer>
      </DataContainer>
      <ListContainer>
        <ListTextContainer>
          <h3>최근 본 레시피</h3>
        </ListTextContainer>
        <ListBox>
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
        </ListBox>
      </ListContainer>
    </Layout>
  );
};

export default Activities;

const DataContainer = styled.div`
  height: 490px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;
const DataGraphContainer = styled.div`
  height: 250px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
`;
const DataItemContainer = styled.div`
  height: 240px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
`;
const DataItemTextContainer = styled.div`
  height: 100px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
`;
const DataItemImageContainer = styled.div`
  height: 140px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
`;
const DataItems = styled.div`
  height: 100px;
  width: 40%;
  border: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
`;
const DataItemImage = styled.div`
  height: 70px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
`;
const DataItemText = styled.div`
  height: 30px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
`;

const ListContainer = styled.div`
  height: 300px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
`;
const ListTextContainer = styled.div`
  height: 40px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const ListBox = styled.div`
  height: 300px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
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
