import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import apiClient from "../../services/api";
import { getCookie } from "../../utils/cookieUtil"; 

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  border: 1px solid rgb(224, 224, 224);
  border-radius: 8px;
  background-color: white;
  overflow: hidden;
`;

const FormWrapper = styled.div`
  position: absolute;
  top: 30%;
  width: 80%;
  max-width: 400px;
  transform: translateY(-30%);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #005bb5;
  }
`;

const AdminLogin = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post("/admin/login", {
        username: form.username,
        password: form.password,
      });

      if (response.status === 200) {
        navigate("/admin/dashboard"); // 로그인 후 관리자 페이지로 이동
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
    }
  };

  useEffect(() => {
    // 로그인 상태 확인
    const token = getCookie("accessToken");
    if (token) {
      navigate("/admin/dashboard"); // 이미 로그인된 상태라면 대시보드로 리다이렉트
    } else {
      setIsLoading(false); // 로그인 상태 확인이 끝나면 로딩 상태 종료
    }
  }, [navigate]);

  // 로딩 중일 때는 아무것도 보여주지 않음
  if (isLoading) {
    return null; // 혹은 로딩 스피너를 추가할 수 있음
  }

  return (
    <Container>
      <FormWrapper>
        <Title>관리자 로그인</Title>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form style={{ marginTop: "32px" }} onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">이메일</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </FormGroup>

          <Button type="submit" style={{ marginTop: "16px" }}>로그인</Button>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default AdminLogin;
