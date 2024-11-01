// CarouselData.js
import React from 'react';
import styled from 'styled-components';

const TextField = styled.div`
  h4 {
    margin-bottom: -4px;
    /* 긴 텍스트가 잘리도록 설정 */
    white-space: nowrap; /* 줄바꿈 방지 */
    overflow: hidden; /* 넘치는 부분 숨기기 */
    text-overflow: ellipsis; /* 잘릴 때 '...'으로 표시 */
    width: 100%; /* 가로 크기 설정 */
  }
  div {
    margin-top: 8px;
  }
`;

const CarouselData = ({ name, price, likes, score }) => {
  return (
    <TextField>
      <h4>{name}</h4>
      <div>
        <p>{price}원</p>
      </div>
      <div style={{ display: 'flex' }}>
        <p style={{ color: 'red', margin: '-5px 5px' }}>♥</p>
        <p style={{ margin: '-5px 0px' }}>{likes}K</p>
        <p style={{ color: '#FF9400', margin: '-5px 10px' }}>★</p>
        <p style={{ margin: '-5px -10px' }}>{score}</p>
      </div>
    </TextField>
  );
};

export default CarouselData;
