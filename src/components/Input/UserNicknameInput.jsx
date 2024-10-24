import React from 'react';
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
  nickname,
  setNickname,
  placeholder = '닉네임을 입력하세요',
}) => {
  return (
    <NicknameInputContainer>
      <NicknameInput
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder={placeholder}
      />
      <ResetButton onClick={() => setNickname('')}>
        <RestartAltIcon />
      </ResetButton>
    </NicknameInputContainer>
  );
};

export default UserNicknameInput;
