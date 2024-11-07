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
  transform: translateY(-30%); /* 정확히 30%에서 시작 */
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
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin/");
    } else {
      setLoading(false); // 토큰이 없을 경우에만 로딩 완료
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await apiClient.post('/admin/login', {
        username: form.username,
        password: form.password,
      });
  
      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/admin/");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
    }
  };

  if (loading) {
    // 로딩 중이면 빈 화면을 표시하거나 로딩 스피너를 보여줍니다.
    return null; // 로딩 중인 동안 로그인 페이지가 보이지 않음
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

