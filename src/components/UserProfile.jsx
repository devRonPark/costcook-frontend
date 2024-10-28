import UserNicknameInput from './Input/UserNicknameInput';
import styled from 'styled-components';
import RoundedButton from './common/Button/RoundedButton';
import ProfileImageUploader from './ProfileImageUploader';

const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  margin-top: 60px;
`;

const ButtonContainer = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: center;
`;

const UserProfile = ({
  nickname,
  handleChange,
  profileUrl,
  handleFileChange,
  onClick,
}) => {
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
        placeholder="새로운 닉네임"
      />
      <ButtonContainer>
        <RoundedButton text="저장" onClick={onClick} />
      </ButtonContainer>
    </UserProfileContainer>
  );
};

export default UserProfile;
