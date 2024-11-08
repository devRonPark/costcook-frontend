import styled from 'styled-components';

const DescriptionWrapper = styled.p`
  text-align: ${(props) => props.textAlign || 'left'};
  font-size: ${(props) => props.fontSize || '1.5rem'};
  color: ${(props) => props.color || '#666'};
  line-height: ${(props) => props.lineHeight || '1.5'};
  margin: ${(props) => props.margin || '0'};
  font-family: 'RixXladywatermelonR';
`;

const Description = ({
  text,
  textAlign,
  fontSize,
  color,
  lineHeight,
  margin,
}) => {
  return (
    <DescriptionWrapper
      textAlign={textAlign}
      fontSize={fontSize}
      color={color}
      lineHeight={lineHeight}
      margin={margin}
    >
      {text}
    </DescriptionWrapper>
  );
};

export default Description;
