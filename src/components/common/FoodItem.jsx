import React from 'react';

const FoodItem = ({ receiptImage, title, price, score }) => (
  <div className="list-item">
    <div className="receipt-image">{receiptImage}</div>
    <div className="text-box">
      <h3 className="title-text">{title}</h3>
      <p className="price-text">{price}원</p>
      <p className="star-text">{score}</p>
    </div>
  </div>
);

export default FoodItem;
