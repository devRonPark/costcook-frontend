import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import AuthApi from '../services/auth.api';

// Styled Component 정의
const StyledContainer = styled(Container)`
  max-width: 600px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
`;

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await AuthApi.getMyInfo(); // AuthApi 메소드 호출
        setUserInfo(response.data);
      } catch (err) {
        setError(err.response ? err.response.data : '오류 발생');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <StyledContainer>
      <Typography variant="h4" align="center" color="#333" gutterBottom>
        내 정보 조회
      </Typography>
      {loading && <CircularProgress />}
      {error && (
        <Typography color="red" align="center">
          {error.message}
        </Typography>
      )}
      {userInfo && (
        <Box textAlign="center" mt={2}>
          <Typography>
            <strong>ID:</strong> {userInfo.id}
          </Typography>
          <Typography>
            <strong>Email:</strong> {userInfo.email}
          </Typography>
          <Typography>
            <strong>Nickname:</strong> {userInfo.nickname || 'N/A'}
          </Typography>
          <Typography>
            <strong>Profile URL:</strong> {userInfo.profileUrl || 'N/A'}
          </Typography>
          <Typography>
            <strong>Created At:</strong> {userInfo.createdAt}
          </Typography>
        </Box>
      )}
      {!loading && !error && !userInfo && (
        <Typography>정보를 불러올 수 없습니다.</Typography>
      )}
    </StyledContainer>
  );
};

export default UserInfo;
