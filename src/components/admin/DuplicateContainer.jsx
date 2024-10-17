import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const DuplicateContainer = ({ data, placeholder, onCheckDuplicate }) => {
  const [inputValue, setInputValue] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 버튼 비활성화 상태

  useEffect(() => {
    // 입력값이 비어 있거나 공백만 있을 때 버튼 비활성화
    setIsButtonDisabled(!inputValue.trim());
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCheckDuplicate = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      const duplicate = data.some((item) => item.name === trimmedValue);
      setIsDuplicate(duplicate);

      // 부모 컴포넌트로 중복 여부와 입력값 전달
      if (onCheckDuplicate) {
        onCheckDuplicate(trimmedValue, duplicate);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isButtonDisabled) {
      handleCheckDuplicate(); // 엔터 키로 중복 확인 실행
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
          onKeyPress={handleKeyPress} // 엔터 키 이벤트 등록
        />
        <CheckButton
          onClick={handleCheckDuplicate}
          disabled={isButtonDisabled} // 버튼 비활성화 처리
        >
          중복 확인
        </CheckButton>
      </InputWrapper>
      {isDuplicate !== null && (
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
  height: 48px; /* 높이 고정 */
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;

  &::placeholder {
    color: #aaa;
  }
`;

const CheckButton = styled.button`
  height: 48px; /* 버튼과 입력창의 높이 일치 */
  padding: 0 16px;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#ffc107')};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? '#ccc' : '#e0a800'}; /* 비활성화 시 색상 유지 */
  }
`;

const ResultMessage = styled.div`
  margin-top: 10px;
  color: ${(props) => (props.isDuplicate ? 'red' : 'green')};
  font-weight: bold;
`;

