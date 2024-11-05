import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Pagination from '@mui/material/Pagination';
import { FaStar, FaEye, FaEyeSlash } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import ReviewDetailModal from '../../components/admin/ReviewDetailModal';
import apiClient from '../../services/api';

const AdminReviewList = () => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const fetchReviews = async (currentPage) => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/reviews', {
        params: { page: currentPage, size: itemsPerPage },
      });
      if (response.status === 200) {
        const formattedReviews = response.data.reviews.map((review) => ({
          ...review, id: review.id,
        }));
        setReviews(formattedReviews);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('리뷰 리스트 가져오기 실패:', error);
      setError('리뷰를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const handleReviewClick = (review) => {
    setSelectedReview(review);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
  };

  const renderStatusIcon = (status) => {
    return status === false ? (
      <FaEye color="#b0b0b0" size={20} style={{ verticalAlign: 'middle' }} />
    ) : (
      <FaEyeSlash color="#ff0000" size={20} style={{ verticalAlign: 'middle' }} />
    );
  };

  if (loading) {
    return <LoadingWrapper>리뷰를 불러오는 중입니다...</LoadingWrapper>;
  }

  if (error) {
    return <ErrorWrapper>{error}</ErrorWrapper>;
  }

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
                <td>{review.recipe.title}</td>
                <td>{review.user.nickname}</td>
                <td>
                  <FaStar color="#ffc107" size={16} style={{ margin: '2.5px 5px -2.5px 0px'}} /> 
                  {review.score}
                </td>
                <td>{renderStatusIcon(review.status)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      <PaginationWrapper>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          shape="rounded"
        />
      </PaginationWrapper>

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

  td {
    display: 'flex';
    alignItems: 'center';
  }
  
  th:nth-child(1), td:nth-child(1) {
    width: 40%;
  }

  th:nth-child(2), td:nth-child(2) {
    width: 30%;
  }

  th:nth-child(3), td:nth-child(3) {
    width: 15%;
  }

  th:nth-child(4), td:nth-child(4) {
    width: 20%;
  }
`;

const PaginationWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2em;
`;

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2em;
  color: red;
`;