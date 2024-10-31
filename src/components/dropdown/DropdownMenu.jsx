import styled from 'styled-components';
import DropdownItem from './DropdownItem';

const DropdownMenuStyled = styled.ul`
  position: absolute;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  list-style: none;
  padding: 10px;
  margin: 0;
  z-index: 100; // 다른 요소 위에 표시
  width: 150px; // 드롭다운 너비 조정

  @media (max-width: 768px) {
    width: 120px; // 모바일 화면에서는 너비 감소
  }
`;

const DropdownMenu = ({ items, isOpen, onClose }) => {
  return (
    isOpen && (
      <DropdownMenuStyled>
        {items.map((item, index) => (
          <DropdownItem
            key={index}
            text={item.text}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          />
        ))}
      </DropdownMenuStyled>
    )
  );
};

export default DropdownMenu;
