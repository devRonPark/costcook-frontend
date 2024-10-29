import { useState, useEffect } from 'react';

const useUserInfo = (initialData) => {
  const [userInfo, setUserInfo] = useState({
    nickname: initialData?.nickname || '',
    profileImage: initialData?.profileImage || '', // 기본값 설정
    profileFile: null, // 사용자 프로필 이미지 객체 저장
    taste: {
      preferredIngredients: initialData?.taste?.preferredIngredients || [],
      dislikedIngredients: initialData?.taste?.dislikedIngredients || [],
    },
  });

  const handleUserInfoChange = (field, value) => {
    console.log(`${field}: ${value}`);

    if (field === 'nickname') {
      setUserInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else if (field === 'profileFile') {
      const file = value; // 선택한 파일 가져오기
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUserInfo((prev) => ({
            ...prev,
            profileImage: reader.result, // 이미지 미리보기 업데이트
            profileFile: file, // 파일 객체 저장
          }));
        };
        reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
      }
    } else if (field === 'preferredIngredient') {
      // 선호 재료 선택하는 경우,
      setUserInfo((prev) => {
        const { preferredIngredients, dislikedIngredients } = prev.taste;

        // 기피 재료에 포함되어 있으면 preferredIngredients에 추가하지 않음
        if (dislikedIngredients.some((i) => i.id === value.id)) {
          return prev; // 변경하지 않고 이전 상태 반환
        }

        // preferredIngredients에 포함되어 있으면 제거
        const updatedPreferredIngredients = preferredIngredients.some(
          (i) => i.id === value.id
        )
          ? preferredIngredients.filter((i) => i.id !== value.id) // 제거
          : [...preferredIngredients, value]; // 포함되어 있지 않으면 추가

        return {
          ...prev,
          taste: {
            ...prev.taste,
            preferredIngredients: updatedPreferredIngredients,
          },
        };
      });
    } else if (field === 'dislikedIngredient') {
      // 기피 재료 선택하는 경우,
      setUserInfo((prev) => {
        const { preferredIngredients, dislikedIngredients } = prev.taste;

        // 선호 재료에 포함되어 있으면 그대로 유지
        if (preferredIngredients.some((i) => i.id === value.id)) {
          return prev; // 변경하지 않고 이전 상태 반환
        }

        // dislikedIngredients에 포함되어 있으면 제거
        const updatedDislikedIngredients = dislikedIngredients.some(
          (i) => i.id === value.id
        )
          ? dislikedIngredients.filter((i) => i.id !== value.id) // 제거
          : [...dislikedIngredients, value]; // 포함되어 있지 않으면 추가

        return {
          ...prev,
          taste: {
            ...prev.taste,
            dislikedIngredients: updatedDislikedIngredients,
          },
        };
      });
    }
  };

  return { userInfo, setUserInfo, handleUserInfoChange };
};

export default useUserInfo;
