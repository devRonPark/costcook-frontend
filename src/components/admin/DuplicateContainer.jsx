import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import apiClient from '../../services/api';

const DuplicateContainer = ({ apiEndpoint, placeholder, onCheckDuplicate, queryParamName, isEditing = false, defaultValue = '' }) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isDuplicate, setIsDuplicate] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(isEditing);

  useEffect(() => {
    // 입력값이 비어있거나 수정 모드일 때 버튼 비활성화
    setIsButtonDisabled(isEditing || !inputValue.trim());
  }, [inputValue, isEditing]);

  const handleInputChange = (e) => {
    if (!isEditing) {
      setInputValue(e.target.value);
    }
  };

  const handleCheckDuplicate = async () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && apiEndpoint) {
      try {
        const response = await apiClient.get(apiEndpoint, { params: { [queryParamName]: trimmedValue } });
        const duplicate = response.data.exists;
        setIsDuplicate(duplicate);

        if (onCheckDuplicate) {
          onCheckDuplicate(trimmedValue, duplicate);
        }
      } catch (error) {
        console.error('중복 확인 중 오류 발생:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isButtonDisabled && !isEditing) {
      handleCheckDuplicate();
    }
  };

  return (
    <Container>
      <InputWrapper>
        <StyledInput
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isEditing} // 수정 모드일 때 입력창 비활성화
          isEditing={isEditing}
        />
        <CheckButton
          onClick={handleCheckDuplicate}
          disabled={isButtonDisabled}
          isEditing={isEditing}
        >
          중복 확인
        </CheckButton>
      </InputWrapper>
      {isDuplicate !== null && !isEditing && (
        <ResultMessage isDuplicate={isDuplicate}>
          {isDuplicate ? '중복된 항목입니다.' : '사용 가능한 항목입니다.'}
        </ResultMessage>
      )}
    </Container>
  );
};

export default DuplicateContainer;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* 검색창과 버튼 사이 여백 */
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 12px;
  height: 48px;
  border: 1px solid ${(props) => (props.isEditing ? '#aaa' : '#ccc')};
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
  background-color: ${(props) => (props.isEditing ? '#f5f5f5' : 'white')};
  color: ${(props) => (props.isEditing ? '#777' : 'black')};

  &::placeholder {
    color: #aaa;
  }
`;

const CheckButton = styled.button`
  height: 48px;
  padding: 0 16px;
  background-color: ${(props) => (props.disabled ? '#ccc' : props.isEditing ? '#aaa' : '#ffc107')};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? '#ccc' : props.isEditing ? '#aaa' : '#e0a800'};
  }
`;

const ResultMessage = styled.div`
  margin-top: 10px;
  color: ${(props) => (props.isDuplicate ? 'red' : 'green')};
  font-weight: bold;
`;
