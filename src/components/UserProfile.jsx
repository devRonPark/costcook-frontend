import UserNicknameInput from './Input/UserNicknameInput';
import styled from 'styled-components';
import RoundedButton from './common/Button/RoundedButton';
import ProfileImageUploader from './ProfileImageUploader';
import ButtonContainer from './common/Button/ButtonContainer';
import apiClient from '../services/api';
import { useEffect, useState } from 'react';
import { generateRandomNickname } from '../utils/nicknameGenerator';

const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  margin-top: 60px;
`;

const UserProfile = ({
  nickname,
  handleChange,
  profileUrl,
  handleFileChange,
  onClick,
}) => {
  const [nicknameAvailable, setNicknameAvailable] = useState(null);
  const [isChecked, setIsChecked] = useState(false); // 중복 확인 상태

  // 닉네임 값이 변경될 때 중복 확인 해제
  useEffect(() => {
    setIsChecked(false);
    setNicknameAvailable(null);
  }, [nickname]);

  const handleDuplicateCheck = async () => {
    if (!nickname) {
      console.error('닉네임이 입력되지 않았습니다.');
      return;
    }
    console.log(nickname);

    try {
      const response = await apiClient.get(
        `/users/nickname/duplicate-check?nickname=${nickname}`
      );

      if (response.data.nicknameDuplicated) {
        setNicknameAvailable(false); // 중복된 닉네임
        setIsChecked(false);
      } else {
        setNicknameAvailable(true); // 사용 가능한 닉네임
        setIsChecked(true); // 중복 확인 완료 상태
      }
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
    }
  };

  const renewNickname = () => {
    handleChange('nickname', generateRandomNickname());
    setNicknameAvailable(null);
    setIsChecked(false); // 중복 확인 취소
  };

  return (
    <UserProfileContainer>
      <ProfileImageUploader
        imageUrl={profileUrl}
        onImageChange={handleFileChange}
      />{' '}
      {/* 프로필 이미지 수정 컴포넌트 포함 */}
      <UserNicknameInput
        name="nickname"
        value={nickname}
        handleChange={handleChange}
        handleDuplicateCheck={handleDuplicateCheck}
        isChecked={isChecked}
        nicknameAvailable={nicknameAvailable}
        renewNickname={renewNickname}
        placeholder="새로운 닉네임"
      />
      <div
        style={{
          color: nicknameAvailable === false ? 'red' : 'green',
          width: '80%',
          margin: '0 auto',
        }}
      >
        {nicknameAvailable === null
          ? ''
          : nicknameAvailable
          ? '사용 가능한 닉네임입니다.'
          : '이미 사용 중인 닉네임입니다.'}
      </div>
      <ButtonContainer>
        <RoundedButton
          text="저장"
          onClick={onClick}
          width="80%"
          backgroundColor="#2196f3"
          hoverBackgroundColor="none"
          isDisabled={!nicknameAvailable}
        />
      </ButtonContainer>
    </UserProfileContainer>
  );
};

export default UserProfile;
