import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const ThumbnailUploader = ({ onImageUpload, onImageRemove }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null); // 파일 인풋을 직접 참조하기 위한 ref

  // 이미지 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
        onImageUpload(file); // 부모 컴포넌트에 파일 전달
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 삭제 핸들러
  const handleImageRemove = () => {
    setThumbnail(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
    if (onImageRemove) {
      onImageRemove(); 
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
        onImageUpload(file); // 부모 컴포넌트에 파일 전달
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <UploaderContainer
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      isDragging={isDragging} // 드래그 상태 전달
    >
      {thumbnail ? (
        <PreviewImage src={thumbnail} alt="썸네일 미리보기" />
      ) : (
        <Placeholder>이미지를 업로드하세요</Placeholder>
      )}
      <ButtonContainer>
        <IconLabel htmlFor="fileInput">
          <PhotoCameraIconStyled />
          이미지 선택
        </IconLabel>
        {thumbnail && (
          <IconButton onClick={handleImageRemove}>
            <DeleteIconStyled />
            이미지 삭제
          </IconButton>
        )}
      </ButtonContainer>
      <HiddenFileInput
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
      />
    </UploaderContainer>
  );
};

export default ThumbnailUploader;

// 스타일 컴포넌트 정의

const UploaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 20px auto;
  border: 2px dashed ${(props) => (props.isDragging ? '#007bff' : '#ccc')};
  background-color: ${(props) => (props.isDragging ? '#e9f5ff' : 'transparent')};
  border-radius: 10px;
  padding: 20px;
  transition: background-color 0.3s, border-color 0.3s;
`;

const Placeholder = styled.div`
  color: #999;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 20px;
`;

const PreviewImage = styled.img`
  width: 100%;
  margin-bottom: 40px;
  border-radius: 10px;
  object-fit: cover;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
`;

const IconLabel = styled.label`
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.25rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const IconButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.25rem;

  &:hover {
    background-color: #c82333;
  }
`;

const PhotoCameraIconStyled = styled(PhotoCameraIcon)`
  color: white;
  font-size: 2rem;
`;

const DeleteIconStyled = styled(DeleteIcon)`
  color: white;
  font-size: 2rem;
`;

const HiddenFileInput = styled.input`
  display: none;
`;