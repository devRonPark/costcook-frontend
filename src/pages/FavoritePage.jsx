import styled from 'styled-components';
import { Button, Checkbox } from '@mui/material';
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import RoundedButton from '../components/common/Button/RoundedButton';

const FavoritePage = () => {
  const [isDeleteStatus, setIsDeleteStatus] = useState(false);

  const toggleDeleteStatus = () => {
    setIsDeleteStatus((prev) => !prev); // 삭제 상태 토글
  };
  return (
    <Layout>
      <Button onClick={toggleDeleteStatus}>
        {isDeleteStatus ? '취소' : '삭제하기'}
      </Button>
      <DataContainer>
        <DataBoxContainer>
          {isDeleteStatus && <CheckBox />}
          <DataBox>
            <ImageBox>이미지</ImageBox>
            <TextBox>
              <TitleText>김치볶음밥</TitleText>
              <PriceText>4300원</PriceText>
              <StarText>★★★★☆ 4.0</StarText>
            </TextBox>
          </DataBox>
        </DataBoxContainer>

        <DataBoxContainer>
          {isDeleteStatus && <CheckBox />}
          <DataBox>
            <ImageBox>이미지</ImageBox>
            <TextBox>
              <TitleText>김치볶음밥</TitleText>
              <PriceText>4300원</PriceText>
              <StarText>★★★★☆ 4.0</StarText>
            </TextBox>
          </DataBox>
        </DataBoxContainer>
      </DataContainer>
      {isDeleteStatus && (
        <RoundedButton text="삭제하기" backgroundColor="red" />
      )}
    </Layout>
  );
};

export default FavoritePage;

// 구현할때 고려사항

// 한개라도 Data가 있으면 Height를 690으로 고정시키기
const DataContainer = styled.div`
  margin: 20px 0px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid black;
`;

const DataBoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const DataBox = styled.div`
  margin: 20px 0px;
  width: 70%;
  height: 130px;
  display: flex;
  flex-direction: row;
  border: 1px solid black;
`;

const CheckBox = styled(Checkbox)`
  width: 50px;
`;

const ImageBox = styled.div`
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextBox = styled.div`
  padding: 10px 5px;
`;

const TitleText = styled.h3`
  margin: 10px 0px;
`;
const PriceText = styled.h4`
  margin: 10px 0px;
`;

const StarText = styled.h4`
  margin: 10px 0px;
`;
