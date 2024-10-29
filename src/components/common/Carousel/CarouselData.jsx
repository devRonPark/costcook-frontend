// CarouselData.js
import React from 'react';
import styled from 'styled-components';

const TextField = styled.div`
  h3 {
    margin: 0;
  }
  div {
    margin-top: 8px;
  }
`;

const CarouselData = ({ name, price, likes, score }) => {
  return (
    <TextField>
      <h3>{name}</h3>
      <div>
        <p>{price}원</p>
      </div>
      <p style={{ color: 'red' }}>♥</p>
      <p> {likes}K</p>
      <p style={{ color: '#FF9400' }}> ★</p>
      <p> {score}</p>
    </TextField>
  );
};

export default CarouselData;
