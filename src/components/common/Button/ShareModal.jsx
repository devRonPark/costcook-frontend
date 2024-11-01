import React, { useEffect } from 'react';
import styled from 'styled-components';

// 공유하기 모달
export default function ShareModal({ onClose, data }) {
  const resultUrl = window.location.href; // 현재 페이지 URL

  // 현재 페이지 URL 복사
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(resultUrl)
      .then(() => {
        alert('레시피 주소가 복사되었습니다!'); // 복사 성공 알림
      })
      .catch((error) => {
        console.error('주소 복사 실패:', error); // 복사 실패 로그
      });
  };

  // 카카오 SDK
  useEffect(() => {
    const loadKakaoSDK = () => {
      return new Promise((resolve, reject) => {
        if (window.Kakao && window.Kakao.isInitialized()) {
          resolve(); // 초기화 완료
        } else if (window.Kakao) {
          window.Kakao.init(import.meta.env.VITE_KAKAO_CLIENT_ID);
          console.log('Kakao SDK가 초기화되었습니다.'); // 초기화 성공 메시지
          resolve(); // 초기화 완료
        } else {
          reject(new Error('Kakao SDK가 로드되지 않았습니다.'));
        }
      });
    };

    loadKakaoSDK().catch((error) => {
      console.error('Kakao SDK 초기화 중 오류 발생:', error);
    });
  }, []);

  // 카카오 공유하기
  const shareKaKao = () => {
    if (!window.Kakao) {
      console.error('카카오 공유하기 SDK가 로드되지 않음');
      return;
    }
    if (window.Kakao.isInitialized()) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: data.title,
          imageUrl: `${import.meta.env.VITE_SERVER}/img/recipe/costcook.png`,
          link: {
            mobileWebUrl: resultUrl,
          },
        },
        buttons: [
          {
            title: '자세히 보기',
            link: {
              mobileWebUrl: resultUrl,
            },
          },
        ],
      });
    } else {
      console.error('카카오 공유하기 SDK가 초기화되지 않음');
    }
  };

  const handleShare = () => {
    shareKaKao(); // 공유 함수 호출
  };

  return (
    <>
      <ModalOverlay onClick={onClose} /> {/* 모달 외부 클릭 시 닫기 */}
      <ModalContainer>
        <h2>공유하기</h2>
        <div>
          <Button onClick={copyToClipboard}>URL 복사하기</Button>
          <Button onClick={handleShare}>카카오톡으로 공유하기</Button>
        </div>
        <Button onClick={onClose}>닫기</Button> {/* 모달 닫기 버튼 */}
      </ModalContainer>
    </>
  );
}

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
