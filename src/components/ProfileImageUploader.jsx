import React from 'react';
import styled from 'styled-components';
import EditIcon from '@mui/icons-material/Edit';
import { defaultImagePath } from '../utils/constant';

const Container = styled.div`
  display: flex; /* Flexbox 활성화 */
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  width: 300px; /* ImagePreviewContainer와 동일한 너비 설정 */
  height: 300px; /* ImagePreviewContainer와 동일한 높이 설정 */
  margin: 0 auto; /* 좌우 기준 가운데 정렬 */
  position: relative;
`;

// 이미지 미리보기 컴포넌트
const ImagePreviewContainer = styled.div`
  position: relative; /* 상대 위치 설정 */
  width: 300px; /* 모바일 화면 기준으로 크기 조정 */
  height: 300px; /* 이미지 높이 */
  border-radius: 50%; /* 둥근 이미지 */
  overflow: hidden; /* 내용이 넘칠 경우 잘리게 함 */
  border: 2px solid #ddd; /* 테두리 추가 */
  background-color: #f0f0f0; /* 기본 배경색 */
  margin: 0 auto; /* 좌우 기준 가운데 정렬 */
`;

const ProfileImage = styled.img`
  width: 100%; /* 이미지가 컨테이너에 맞게 조정 */
  height: 100%; /* 이미지 높이 */
  object-fit: cover; /* 이미지 비율 유지하며 잘리게 설정 */
`;

const Placeholder = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EditButton = styled.label`
  position: absolute; /* 절대 위치 설정 */
  top: 5px; /* 상단 여백 */
  right: 5px; /* 우측 여백 */
  z-index: 10; /* 다른 요소 위에 표시 */
  cursor: pointer; /* 커서 포인터로 변경 */
  transition: 0.3s; /* 애니메이션 효과 */
  background-color: rgba(0, 150, 136, 0.8); /* 강조된 색상으로 배경색 변경 */
  border-radius: 50%; /* 버튼 둥글게 */
  padding: 8px; /* 버튼 내부 여백 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 그림자 추가로 부각 */

  &:hover {
    background-color: rgba(0, 150, 136, 1); /* Hover 시 배경색 변경 */
    color: white; /* Hover 시 글자색 변경 */
  }
`;

const HiddenFileInput = styled.input`
  display: none; /* 파일 입력 숨김 */
`;

const ProfileImageUploader = ({
  imageUrl, // 프로필 이미지 URL
  onImageChange, // 이미지 변경 핸들러
}) => {
  console.log(imageUrl);
  return (
    <Container>
      <ImagePreviewContainer>
        (
        <ProfileImage
          src={
            imageUrl === null || imageUrl.includes('null')
              ? defaultImagePath
              : `${import.meta.env.VITE_BASE_SERVER_URL}${imageUrl}`
          }
          alt="Profile"
        />
        )
      </ImagePreviewContainer>
      <EditButton>
        <EditIcon style={{ color: 'white' }} />
        <HiddenFileInput
          type="file"
          accept="image/*"
          onChange={onImageChange} // 파일 변경 핸들러 연결
        />
      </EditButton>
    </Container>
  );
};

export default ProfileImageUploader;
