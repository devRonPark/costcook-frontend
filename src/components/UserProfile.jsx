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
  const [nicknameError, setNicknameError] = useState(null); // 닉네임 오류 상태

  // 닉네임 값이 변경될 때 중복 확인 해제 및 유효성 체크
  useEffect(() => {
    setIsChecked(false);
    setNicknameAvailable(null);
    setNicknameError(null);

    // 닉네임 유효성 검사
    const isValidNickname = /^[a-zA-Z0-9가-힣_]+$/.test(nickname);

    if (!isValidNickname && nickname.length > 0) {
      setNicknameError(
        '닉네임은 알파벳, 숫자, 한글, 밑줄(_)만 사용할 수 있습니다.'
      );
    } else {
      setNicknameError(null); // 유효한 닉네임이면 오류 없음
    }
  }, [nickname]);

  const handleDuplicateCheck = async () => {
    if (!nickname || nicknameError) {
      console.error('닉네임이 입력되지 않았거나 유효하지 않습니다.');
      return;
    }

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
    setNicknameError(null); // 유효성 오류도 초기화
  };

  return (
    <UserProfileContainer>
      <ProfileImageUploader
        imageUrl={profileUrl}
        onImageChange={handleFileChange}
      />
      <UserNicknameInput
        name="nickname"
        value={nickname}
        handleChange={handleChange}
        handleDuplicateCheck={handleDuplicateCheck}
        isChecked={isChecked}
        nicknameAvailable={nicknameAvailable}
        renewNickname={renewNickname}
        placeholder="새로운 닉네임"
        borderColor={nicknameError ? 'red' : undefined} // 오류 시 빨간색 보더
      />
      {nicknameError && (
        <div style={{ color: 'red', width: '80%', margin: '0 auto' }}>
          {nicknameError}
        </div>
      )}
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
          isDisabled={!nicknameAvailable || nicknameError} // 오류가 있으면 저장 불가능
        />
      </ButtonContainer>
    </UserProfileContainer>
  );
};

export default UserProfile;
