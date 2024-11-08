import styled from 'styled-components';

const CardListContainer = styled.div`
  display: flex;
  gap: 10px; // 카드 간격 설정

  ${({ layoutType }) => {
    switch (layoutType) {
      case 'favorite': // 즐겨찾기 페이지
      case 'search': // 검색 페이지
        return `
          width: 100%;
          margin: 20px 0px;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        `;
      case 'recipe': // 레시피 목록 페이지
        return `
          @media (max-width: 500px) {
            flex-direction: column;
            align-items: center;
            }
          @media (min-width: 501px) {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
          }
        `;
      case 'home': // 홈 페이지
        return `
          flex-direction: row;

          @media (max-width: 800px) {
            flex-wrap: wrap;
          }
        `;
      default:
        return '';
    }
  }}
`;

export default CardListContainer;
