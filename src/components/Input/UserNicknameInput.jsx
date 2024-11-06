import React, { useRef } from 'react';
import styled from 'styled-components';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckIcon from '@mui/icons-material/Check';
import { Button } from '@mui/material';

const NicknameInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0 auto;
`;

const NicknameInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const NicknameInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 12px;
  font-size: 16px;
  border: 1px solid
    ${(props) =>
      props.nicknameAvailable
        ? 'green'
        : props.nicknameAvailable === false
        ? 'red'
        : '#ccc'};
  border-radius: 25px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${(props) => (props.nicknameAvailable ? 'green' : '#aaa')};
  }
`;

const ResetButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  padding: 5px;

  &:hover {
    background-color: #f0f0f0;
    border-radius: 50%;
  }
`;

const DuplicateCheckButton = styled(Button)`
  && {
    background-color: ${({
      isChecked,
      hasValue,
      disabled,
      nicknameAvailable,
    }) =>
      isChecked
        ? 'green' // 중복 확인 완료 상태일 경우
        : disabled
        ? '#ccc' // 비활성화 상태일 경우
        : nicknameAvailable === false
        ? 'red' // 중복된 닉네임일 경우 빨간색
        : hasValue
        ? '#1976d2' // 닉네임이 입력된 경우 파란색
        : '#333'}; // 기본 색상 (값이 없을 때)
    color: white;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 20px;
    margin-left: 10px;
    box-shadow: none;
    cursor: pointer;

    &:disabled {
      color: #ffffff;
    }
  }
`;

const UserNicknameInput = ({
  name,
  value,
  handleChange,
  handleDuplicateCheck,
  placeholder = '닉네임을 입력하세요',
  isChecked,
  resetNickname,
  nicknameAvailable,
}) => {
  const inputRef = useRef();

  const handleReset = () => {
    resetNickname();
    inputRef.current.focus();
  };

  return (
    <NicknameInputContainer>
      <NicknameInputWrapper>
        <NicknameInput
          type="text"
          name={name}
          value={value}
          onChange={(e) => handleChange(name, e.target.value)}
          placeholder={placeholder}
          ref={inputRef}
          nicknameAvailable={nicknameAvailable}
        />
        <ResetButton onClick={handleReset}>
          <RestartAltIcon />
        </ResetButton>
      </NicknameInputWrapper>

      <DuplicateCheckButton
        onClick={handleDuplicateCheck}
        disabled={isChecked || !value}
        isChecked={isChecked}
        hasValue={!!value} // value가 존재할 경우 true로 설정
        nicknameAvailable={nicknameAvailable}
      >
        {isChecked ? <CheckIcon /> : '중복 확인'}
      </DuplicateCheckButton>
    </NicknameInputContainer>
  );
};

export default UserNicknameInput;
