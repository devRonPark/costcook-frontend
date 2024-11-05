import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Pagination from '@mui/material/Pagination';
import { FaStar, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import ReviewDetailModal from '../../components/admin/ReviewDetailModal';
import apiClient from '../../services/api';

const AdminReviewList = () => {
  // State 설정
  const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' }); // 정렬 설정
  const [reviews, setReviews] = useState([]); // 리뷰 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [page, setPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const itemsPerPage = 5; // 페이지당 항목 수

  // 리뷰 데이터 가져오기 함수
  const fetchReviews = async (currentPage) => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/reviews', {
        params: {
          page: currentPage,
          size: itemsPerPage,
          sortBy: sortConfig.key, // 정렬 기준
          direction: sortConfig.direction, // 정렬 방향 (오름차순/내림차순)
        },
      });

      // 성공적으로 데이터를 가져오면 리뷰 목록과 총 페이지 수를 업데이트
      if (response.status === 200) {
        const formattedReviews = response.data.reviews.map((review) => ({
          ...review, id: review.id,
        }));
        setReviews(formattedReviews);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      // 에러 발생 시 에러 메시지 설정
      setError('리뷰를 불러오는데 실패했습니다.');
    } finally {
      // 로딩 상태 종료
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 또는 페이지/정렬 변경 시 데이터 가져오기
  useEffect(() => {
    fetchReviews(page);
  }, [page, sortConfig]);

  // 리뷰 클릭 시 리뷰 모달 표시
  const handleReviewClick = (review) => {
    setSelectedReview(review);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setSelectedReview(null);
  };

  // 정렬 기준 변경 함수 (헤더 클릭 이벤트)
  const handleSort = (key) => {
    let direction = 'asc';
    // 동일한 키를 다시 클릭하면 정렬 방향을 토글
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 정렬 아이콘을 설정하는 함수
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? (
        <FaSortUp style={{ verticalAlign: 'middle' }} />
      ) : (
        <FaSortDown style={{ marginTop: '-4px', marginBottom: '4px', verticalAlign: 'middle' }} />
      );
    }
    return <FaSort />;
  };

  // 리뷰 상태 아이콘 표시 함수
  const renderStatusIcon = (status) => {
    return status === false ? (
      <FaEye color="#b0b0b0" size={20} style={{ verticalAlign: 'middle' }} />
    ) : (
      <FaEyeSlash color="#ff0000" size={20} style={{ verticalAlign: 'middle' }} />
    );
  };

  // 로딩 상태일 때의 화면
  if (loading) {
    return (
      <AdminLayout title="리뷰">
        <LoadingWrapper>리뷰를 불러오는 중입니다...</LoadingWrapper>;
      </AdminLayout>
    ) 
  }

  // 에러 발생 시의 화면
  if (error) {
    return (
      <AdminLayout title="리뷰">
        <ErrorWrapper>{error}</ErrorWrapper>;
      </AdminLayout>
    )
  }

  // 실제 화면 렌더링
  return (
    <AdminLayout title="리뷰">
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th onClick={() => handleSort('recipe.title')}>
                레시피 {sortConfig.key === 'recipe.title' && getSortIcon('recipe.title')}
              </th>
              <th onClick={() => handleSort('user.nickname')}>
                작성자 {sortConfig.key === 'user.nickname' && getSortIcon('user.nickname')}
              </th>
              <th onClick={() => handleSort('score')}>
                평점 {sortConfig.key === 'score' && getSortIcon('score')}
              </th>
              <th onClick={() => handleSort('status')}>
                상태 {sortConfig.key === 'status' && getSortIcon('status')}
              </th>
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

      {/* 페이지네이션 컴포넌트 */}
      <PaginationWrapper>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          shape="rounded"
          siblingCount={2}
          boundaryCount={0}
          showFirstButton
          showLastButton 
        />
      </PaginationWrapper>

      {/* 리뷰 모달 컴포넌트 */}
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
    padding-right: 0.5em;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  th:nth-child(1), td:nth-child(1) {
    width: 40%;
  }

  th:nth-child(2), td:nth-child(2) {
    width: 25%;
  }

  th:nth-child(3), td:nth-child(3) {
    width: 17.5%;
  }

  th:nth-child(4), td:nth-child(4) {
    width: 17.5%;
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
  margin-top: 80px;
`;

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 80px;
  font-size: 1.2em;
  color: red;
`;