import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ReviewDetailModal from '../../components/admin/ReviewDetailModal';
import styled from 'styled-components';
import { FaStar, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminReviewList = () => {
  const [selectedReview, setSelectedReview] = useState(null);

  const reviews = [
    {
      recipeName: '토마토 파스타',
      author: '요리사A',
      rating: 5,
      comment: '정말 맛있어요! 다음에 또 만들고 싶어요.',
      createdAt: '2024-11-01',
      updatedAt: '2024-11-01',
      status: '공개',
      deletedAt: null,
    },
    {
      recipeName: '닭갈비',
      author: '식객B',
      rating: 3,
      comment: '좀 짰어요.',
      createdAt: '2024-10-30',
      updatedAt: '2024-11-01',
      status: '비공개',
      deletedAt: '2024-11-01',
    },
    {
      recipeName: '감자전',
      author: '요리왕C',
      rating: 4,
      comment: '바삭하고 간단한 레시피네요!',
      createdAt: '2024-11-02',
      updatedAt: '2024-11-02',
      status: '공개',
      deletedAt: null,
    },
    {
      recipeName: '된장찌개',
      author: '맛객D',
      rating: 2,
      comment: '된장 맛이 조금 약한 것 같아요.',
      createdAt: '2024-11-03',
      updatedAt: '2024-11-03',
      status: '비공개',
      deletedAt: '2024-11-04',
    },
    {
      recipeName: '불고기',
      author: '소믈리에E',
      rating: 5,
      comment: '고기의 부드러움과 양념이 완벽해요!',
      createdAt: '2024-11-04',
      updatedAt: '2024-11-04',
      status: '공개',
      deletedAt: null,
    },
  ];

  const handleReviewClick = (review) => {
    setSelectedReview(review);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    return [...Array(totalStars)].map((_, index) => (
      <FaStar
        key={index}
        color={index < rating ? '#ffc107' : '#e4e5e9'}
        size={20}
        style={{ marginRight: '2px' }}
      />
    ));
  };

  const renderStatusIcon = (status) => {
    return status === '공개' ? (
      <FaEye color="#b0b0b0" size={20} />
    ) : (
      <FaEyeSlash color="#b0b0b0" size={20} />
    );
  };

  return (
    <AdminLayout title="리뷰">
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>레시피</th>
              <th>작성자</th>
              <th>평점</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={index} onClick={() => handleReviewClick(review)}>
                <td>{review.recipeName}</td>
                <td>{review.author}</td>
                <td>{renderStars(review.rating)}</td>
                <td>{renderStatusIcon(review.status)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      {/* 모달 컴포넌트 사용 */}
      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={handleCloseModal}
        />
      )}
    </AdminLayout>
  );
};

export default AdminReviewList;

// 스타일 정의
const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 60px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;

  th, td {
    padding: 0.8em;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
  }

  tr {
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  tr:hover {
    background-color: #f9f9f9;
  }
`;
