// 기본 이미지 경로 설정
export const defaultImagePath = `${
  import.meta.env.VITE_PUBLIC_URL
}/default_user_profile.png`;

// 화면에 렌더링되는 재료 정보
export const ingredients = [
  {
    id: 28,
    name: '소고기',
    imageUrl: `/category_beef.png`,
  },
  {
    id: 11,
    name: '돼지고기',
    imageUrl: `/category_pork.png`,
  },
  {
    id: 3,
    name: '닭고기',
    imageUrl: `/category_chicken.png`,
  },
  {
    id: 5,
    name: '건어물류',
    imageUrl: `/category_dried_fish.png`,
  },
  {
    id: 13,
    name: '과일류',
    imageUrl: `/category_fruit.png`,
  },
  {
    id: 29,
    name: '버섯류',
    imageUrl: `/category_mushroom.png`,
  },
  {
    id: 7,
    name: '곡류',
    imageUrl: `/category_rice.png`,
  },
  {
    id: 12,
    name: '달걀/유제품',
    imageUrl: `/category_dairy.png`,
  },

  {
    id: 4,
    name: '밀가루',
    imageUrl: `/category_flour.png`,
  },
];

export const COLORS = {
  PREFERRED: {
    COLOR: '#0a2aff', // 선호재료 색깔
    BORDER: '#0052cc', // 선호재료 경계선 색깔
    BACKGROUND: '#e6f0ff', // 선호재료 배경색
    HOVER_BACKGROUND: '#b3d7ff', // 선호재료 hover 배경색
  },
  DISLIKED: {
    COLOR: '#ff080c', // 비선호재료 색깔
    BORDER: '#cc0000', // 비선호재료 경계선 색깔
    BACKGROUND: '#ffe6e6', // 비선호재료 배경색
    HOVER_BACKGROUND: '#ffb3b3', // 비선호재료 hover 배경색
  },
};
