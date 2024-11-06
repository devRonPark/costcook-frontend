import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Pagination from '@mui/material/Pagination';
import { FaStar, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import ReviewDetailModal from '../../components/admin/ReviewDetailModal';
import apiClient from '../../services/api';
import AdminSearchForm from '../../components/admin/AdminSearchForm';

const AdminReviewList = () => {
  // State 설정
  const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' }); // 정렬 설정
  const [reviews, setReviews] = useState([]); // 리뷰 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [page, setPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const [inputKeyword, setInputKeyword] = useState(''); // 폼에 입력된 검색 키워드 상태
  const [serverKeyword, setServerKeyword] = useState(''); // 서버에 적용된 검색 키워드 상태
  const [categories] = useState(['레시피', '작성자']); // 카테고리 목록 (고정값)
  const [inputCategory, setInputCategory] = useState('레시피'); // 폼에 선택된 카테고리
  const [serverCategory, setServerCategory] = useState(''); // 서버에 적용된 카테고리
  const itemsPerPage = 5; // 페이지당 항목 수

  // 리뷰 데이터 가져오기 함수
  const fetchReviews = async (currentPage, keyword, category) => {
    try {
      setLoading(true);

      // params 객체를 맵처럼 구성
      const params = {
        page: currentPage - 1,
        size: itemsPerPage,
        sortBy: sortConfig.key,
        direction: sortConfig.direction,
      };

      // 검색어가 있을 경우 params에 추가
      if(keyword) {
        params.query = keyword;
      }

      // 선택된 카테고리가 있을 경우 params에 추가
      if(category) {
        params.category = category;
      }

      // 요청을 보낼 때 params 객체 전달
      const response = await apiClient.get('/admin/reviews', { params });

      // 성공적으로 데이터를 가져오면 리뷰 목록과 총 페이지 수를 업데이트
      if(response.status === 200) {
        const formattedReviews = response.data.reviews.map((review) => ({
          ...review,
          id: review.id,
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

  // 컴포넌트 마운트 및 정렬, 페이지 변경 시 데이터 가져오기
  useEffect(() => {
    fetchReviews(page, serverKeyword, serverCategory);
  }, [page, sortConfig, serverKeyword, serverCategory]);

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

    // 정렬 시 폼의 값들을 서버에 적용된 값으로 리셋
    setInputKeyword(serverKeyword);  // 폼 검색어를 서버 검색어로 리셋
    setInputCategory(serverCategory);  // 폼 카테고리를 서버 카테고리로 리셋
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

  // 검색어 변경 핸들러
  const handleKeywordChange = (e) => {
    setInputKeyword(e.target.value);
  };

  // 검색 실행 함수 (검색 버튼 클릭 시)
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 기본 동작 방지
    setPage(1); // 검색할 때 페이지를 첫 번째로 설정
    setServerKeyword(inputKeyword); // 적용된 검색어 업데이트
    setServerCategory(inputCategory); // 적용된 카테고리 업데이트
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (e) => {
    setInputCategory(e.target.value); // 선택된 카테고리 업데이트
  };

  // 리뷰 상태 업데이트를 위한 콜백 함수
  const updateReviewStatus = (reviewId, newStatus) => {
    setReviews(prevReviews => prevReviews.map(review => {
      if (review.id === reviewId) return {...review, status: newStatus}  
      return review
    }));
  };

  // 로딩 상태일 때의 화면
  if (loading) {
    return (
      <AdminLayout title="리뷰">
        <LoadingWrapper>리뷰를 불러오는 중입니다...</LoadingWrapper>
      </AdminLayout>
    ); 
  }

  // 에러 발생 시의 화면
  if (error) {
    return (
      <AdminLayout title="리뷰">
        <ErrorWrapper>{error}</ErrorWrapper>
      </AdminLayout>
    );
  }

  // 리뷰 목록이 비어있는 경우의 화면
  if (reviews.length === 0) {
    return (
      <AdminLayout title="리뷰">
        <NoReviewsWrapper>현재 조회 가능한 리뷰가 없습니다.</NoReviewsWrapper>
        <AdminSearchForm
          inputCategory={inputCategory}
          handleCategoryChange={handleCategoryChange}
          categories={categories}
          inputKeyword={inputKeyword}
          handleKeywordChange={handleKeywordChange}
          handleSearchSubmit={handleSearchSubmit}
        />
      </AdminLayout>
    );
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
                  <FaStar color="#ffc107" size={16} style={{ margin: '2.5px 5px -2.5px 0px' }} />
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
      <AdminSearchForm
        inputCategory={inputCategory}
        handleCategoryChange={handleCategoryChange}
        categories={categories}
        inputKeyword={inputKeyword}
        handleKeywordChange={handleKeywordChange}
        handleSearchSubmit={handleSearchSubmit}
      />

      {/* 리뷰 모달 컴포넌트 */}
      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          setReviews={setReviews}
          onClose={handleCloseModal}
          onStatusChange={updateReviewStatus}
        />
      )}
    </AdminLayout>
  );
};

export default AdminReviewList;

// 스타일 정의
const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 80px;
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
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 160px 0 80px;
  font-size: 1.2em;
  color: ${(props) => props.color || "#333"};
`;

const LoadingWrapper = styled(Wrapper)`
  color: #333; // 기본 색상 (로딩 중일 때)
`;

const ErrorWrapper = styled(Wrapper)`
  color: red; // 에러일 때의 색상
`;

const NoReviewsWrapper = styled(Wrapper)`
  color: #888; // 리뷰가 없을 때의 색상
`;