import styled from 'styled-components';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const MyPage = () => (
  <Layout>
    <DateContainer>
      <ProfileContainer>
        <ProfileImageContainer>프로필 이미지</ProfileImageContainer>
        <ProfileNameContainer>요리하는 잉규형</ProfileNameContainer>
      </ProfileContainer>
      <DateButtonContainer>
        <DateButton>사진 변경</DateButton>
        <DateButton>닉네임 변경</DateButton>
        <DateButton>로그아웃</DateButton>
      </DateButtonContainer>
    </DateContainer>
    <SettingContainer>
      <h4>좋아하는 재료를 추가하거나 수정 할 수 있습니다</h4>
      <SettingButtonContainer>
        <Link to="../list">
          <Button>선호 재료 관리</Button>
        </Link>
      </SettingButtonContainer>
    </SettingContainer>
    <SettingContainer>
      <h4>싫어하는 재료를 추가하거나 수정 할 수 있습니다</h4>
      <SettingButtonContainer>
        <Button>비선호 재료 관리</Button>
      </SettingButtonContainer>
    </SettingContainer>
    <ButtonLayoutContainer>
      <ButtonContainer>
        <Link to="../activities">
          <Button>내 활동</Button>
        </Link>
      </ButtonContainer>
      <ButtonContainer>
        <ButtonSplitBox>
          <Link to="../budget">
            <Button>예산 관리</Button>
          </Link>
        </ButtonSplitBox>
        <ButtonSplitBox>
          <Link to="../review">
            <Button>리뷰 관리</Button>
          </Link>
        </ButtonSplitBox>
      </ButtonContainer>
    </ButtonLayoutContainer>
  </Layout>
);

export default MyPage;

const DateContainer = styled.div`
  height: 300px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
`;

const ProfileContainer = styled.div`
  height: 290px;
  width: 45%;
  border: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;
const ProfileImageContainer = styled.div`
  height: 200px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;
const ProfileNameContainer = styled.div`
  height: 60px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const DateButtonContainer = styled.div`
  height: 290px;
  width: 45%;
  border: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;
const DateButton = styled.div`
  height: 60px;
  width: 90%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const SettingContainer = styled.div`
  height: 100px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;
const SettingButtonContainer = styled.div`
  height: 30px;
  width: 100%;
  margin-top: 10px;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const ButtonLayoutContainer = styled.div`
  height: 290px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const ButtonContainer = styled.div`
  height: 120px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const ButtonSplitBox = styled.div`
  height: 120px;
  width: 50%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;
