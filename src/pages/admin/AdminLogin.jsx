import { useEffect, useState } from "react";
import styled from "styled-components";
import apiClient from "../../services/api";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/admin/");
    } else {
      setLoading(false);
    }
  }, [navigate]);

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

      // 응답에서 accessToken과 refreshToken을 추출합니다.
      const { accessToken, refreshToken } = response.data;

      // accessToken을 로컬 스토리지에 저장합니다.
      localStorage.setItem("accessToken", accessToken);
      
      navigate("/admin/"); // 로그인 후 관리자 페이지로 이동
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
    }
  };

  if (loading) {
    return null; // 로딩 중일 때는 빈 화면을 표시
  }

  return (
    <Container>
      <FormWrapper>
        <Title>Admin Login</Title>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form style={{ marginTop: "32px" }} onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </FormGroup>

          <Button type="submit" style={{ marginTop: "16px" }}>Login</Button>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default AdminLogin;
