import styled from 'styled-components';

const ImageContainer = styled.div`
  position: relative;
  width: ${(props) => props.width || '300px'}; /* 너비를 props로 전달 */
  height: ${(props) => props.height || '300px'}; /* 높이를 props로 전달 */
  /* border-radius: ${(props) =>
    props.borderRadius || '50%'}; 둥근 모양 여부를 props로 조정 */
  border-radius: 10px;
  overflow: hidden;
  border: ${(props) => props.border || '2px solid #ddd'}; /* 테두리 */
  background-color: ${(props) =>
    props.backgroundColor || '#f0f0f0'}; /* 배경색 */
  margin: ${(props) => props.margin || '0 auto'}; /* 가운데 정렬 */
  padding: 30px;
  font-size: 18px;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${(props) =>
    props.objectFit || 'cover'}; /* 이미지 크기 조정 방식 */
  border-radius: 10px;
`;

const ImageDisplay = ({
  src,
  altText,
  width,
  height,
  borderRadius,
  border,
  backgroundColor,
  margin,
  objectFit,
}) => {
  return (
    <ImageContainer
      width={width}
      height={height}
      borderRadius={borderRadius}
      border={border}
      backgroundColor={backgroundColor}
      margin={margin}
    >
      {src ? (
        <StyledImage src={src} alt={altText} objectFit={objectFit} />
      ) : (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {altText || '이미지 없음'}
        </div>
      )}
    </ImageContainer>
  );
};

export default ImageDisplay;
