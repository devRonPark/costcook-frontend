import styled from 'styled-components';

const TitleWrapper = styled.div`
  margin-top: 20px;
  text-align: ${(props) => props.textAlign || 'center'};
  font-size: ${(props) => props.fontSize || '2.5rem'};
  font-weight: bold;
  color: ${(props) => props.color || '#333'};
  font-family: 'GmarketSansMedium';
`;

const Title = ({ text, textAlign, fontSize, color }) => {
  return (
    <TitleWrapper textAlign={textAlign} fontSize={fontSize} color={color}>
      {text}
    </TitleWrapper>
  );
};

export default Title;
