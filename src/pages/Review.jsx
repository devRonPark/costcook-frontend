import styled from 'styled-components';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Layout from '../components/layout/Layout';

const Review = () => {
  return (
    <Layout>
      <DateContainer>
        <ReviewContainer>
          <ReviewImageContainer>리뷰 이미지</ReviewImageContainer>
          <ReviewDataContainer>
            <ReviewTitle>
              <h3>타이틀</h3>
              <ReviewSettingBtn>
                <MoreVertIcon fontSize="small" />
              </ReviewSettingBtn>
            </ReviewTitle>
            <ReviewContent>내용</ReviewContent>
            <ReviewScoreContainer>
              <ReviewScore>★★★★★ 5.0</ReviewScore>
              <ReviewScore>
                <h5>1일전</h5>
              </ReviewScore>
            </ReviewScoreContainer>
          </ReviewDataContainer>
        </ReviewContainer>
        <ReviewContainer>
          <ReviewImageContainer>리뷰 이미지</ReviewImageContainer>
          <ReviewDataContainer>
            <ReviewTitle>
              <h3>타이틀</h3>
              <ReviewSettingBtn>
                <MoreVertIcon fontSize="small" />
              </ReviewSettingBtn>
            </ReviewTitle>
            <ReviewContent>내용</ReviewContent>
            <ReviewScoreContainer>
              <ReviewScore>★★★★★ 5.0</ReviewScore>
              <ReviewScore>
                <h5>1일전</h5>
              </ReviewScore>
            </ReviewScoreContainer>
          </ReviewDataContainer>
        </ReviewContainer>
        <ReviewContainer>
          <ReviewImageContainer>리뷰 이미지</ReviewImageContainer>
          <ReviewDataContainer>
            <ReviewTitle>
              <h3>타이틀</h3>
              <ReviewSettingBtn>
                <MoreVertIcon fontSize="small" />
              </ReviewSettingBtn>
            </ReviewTitle>
            <ReviewContent>내용</ReviewContent>
            <ReviewScoreContainer>
              <ReviewScore>★★★★★ 5.0</ReviewScore>
              <ReviewScore>
                <h5>1일전</h5>
              </ReviewScore>
            </ReviewScoreContainer>
          </ReviewDataContainer>
        </ReviewContainer>
      </DateContainer>
    </Layout>
  );
};

export default Review;

const DateContainer = styled.div`
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px;
`;
const ReviewContainer = styled.div`
  height: 200px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;
const ReviewImageContainer = styled.div`
  height: 180px;
  width: 180px;
  border: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;
const ReviewDataContainer = styled.div`
  height: 180px;
  width: calc(100% - 190px);
  border: 1px black solid;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
`;

const ReviewTitle = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px black solid;
`;
const ReviewSettingBtn = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;
const ReviewContent = styled.div`
  height: 80px;
  width: 100%;
  border-bottom: 1px black solid;
`;
const ReviewScoreContainer = styled.div`
  height: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px black solid;
  align-items: center;
`;
const ReviewScore = styled.div`
  width: auto;
`;
