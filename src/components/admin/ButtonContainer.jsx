// src/components/admin/ButtonContainer.js
import React, { useEffect, useState } from 'react';
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
  flex: 1 1 calc((100% - 30px) / 4);
  max-width: calc((100% - 30px) / 4);

  /* 나머지 스타일은 그대로 유지 */
  background-color: ${(props) => (props.selected ? '#ffc107' : '#007bff')};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 1rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s, width 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    flex: 1 1 calc((100% - 30px) / 4); 
    max-width: calc((100% - 30px) / 4);
  }

  &:hover {
    background-color: ${(props) => (props.selected ? '#e0a800' : '#0056b3')};
  }
`;

const ButtonContainer = ({ items, selectedId, onItemClick }) => {
  const [currentSelectedId, setCurrentSelectedId] = useState(selectedId || null);

  useEffect(() => {
    setCurrentSelectedId(selectedId);
  }, [selectedId]);

  const handleItemClick = (item) => {
    const isSelected = item.id === currentSelectedId;
    setCurrentSelectedId(isSelected ? null : item.id);
    onItemClick(isSelected ? null : item);
  };

  return (
    <Container>
      {items.map((item) => (
        <Button
          key={item.id}
          selected={currentSelectedId === item.id}
          onClick={() => handleItemClick(item)}
        >
          {item.name}
        </Button>
      ))}
    </Container>
  );
};

export default ButtonContainer


