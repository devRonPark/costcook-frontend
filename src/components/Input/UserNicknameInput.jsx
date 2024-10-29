import React, { useRef } from 'react';
import styled from 'styled-components';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const NicknameInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 25px;
  padding: 5px;
  background-color: #fff;
`;

const NicknameInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 10px;
`;

const ResetButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 10px;

  &:hover {
    background-color: #f0f0f0;
    border-radius: 50%;
  }
`;

const UserNicknameInput = ({
  name,
  value,
  handleChange,
  placeholder = '닉네임을 입력하세요',
}) => {
  const inputRef = useRef();

  const handleReset = () => {
    // nickname state 값 초기화
    handleChange(name, '');
    // input 커서 활성화
    inputRef.current.focus();
  };
  return (
    <NicknameInputContainer>
      <NicknameInput
        type="text"
        name={name}
        value={value}
        onChange={(e) => handleChange(name, e.target.value)}
        placeholder={placeholder}
        ref={inputRef}
      />
      <ResetButton onClick={handleReset}>
        <RestartAltIcon />
      </ResetButton>
    </NicknameInputContainer>
  );
};

export default UserNicknameInput;
