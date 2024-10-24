import UserProfileEdit from './UserProfileEdit';
import UserNicknameInput from './Input/UserNicknameInput';

const UserProfile = ({
  nickname,
  setNickname,
  profileImage,
  setProfileImage,
  handleFileChange,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '30px' }}>
      <UserProfileEdit
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        handleFileChange={handleFileChange}
      />{' '}
      {/* 프로필 이미지 수정 컴포넌트 포함 */}
      <UserNicknameInput
        nickname={nickname}
        setNickname={setNickname}
        placeholder="새로운 닉네임"
      />
    </div>
  );
};

export default UserProfile;
