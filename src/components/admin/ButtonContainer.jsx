// src/components/admin/ButtonContainer.js
import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap; /* 줄바꿈 허용 */
  justify-content: flex-start; /* 왼쪽 정렬 */
  gap: 10px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const Button = styled.button`
  background-color: ${(props) => (props.selected ? '#ffc107' : '#007bff')};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 1rem;
  height: 60px;
  flex: 1 1 calc(20% - 10px); /* 기본적으로 한 줄에 5개 */
  max-width: calc(20% - 10px); /* 최대 5개 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s, width 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    flex: 1 1 calc(25% - 10px); /* 화면이 줄어들면 한 줄에 4개 */
    max-width: calc(25% - 10px); /* 최대 4개 */
  }

  &:hover {
    background-color: ${(props) => (props.selected ? '#e0a800' : '#0056b3')};
  }
`;

const ButtonContainer = ({ items, onItemClick }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item.id === selectedItem ? null : item.id);
    onItemClick(item);
  };

  return (
    <Container>
      {items.map((item) => (
        <Button
          key={item.id}
          selected={selectedItem === item.id}
          onClick={() => handleItemClick(item)}
        >
          {item.name}
        </Button>
      ))}
    </Container>
  );
};

export default ButtonContainer


