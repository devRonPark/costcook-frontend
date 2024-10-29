// 기본 이미지 경로 설정
export const defaultImagePath = `${
  import.meta.env.VITE_PUBLIC_URL
}/default_user_profile.png`;
// 화면에 렌더링되는 재료 정보
export const ingredients = [
  {
    id: 28,
    name: '소고기',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_beef.png`,
  },
  {
    id: 11,
    name: '돼지고기',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_pork.png`,
  },
  {
    id: 3,
    name: '닭고기',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_chicken.png`,
  },
  {
    id: 5,
    name: '건어물류',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_dried_fish.png`,
  },
  {
    id: 13,
    name: '과일류',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_fruit.png`,
  },
  {
    id: 29,
    name: '버섯류',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_mushroom.png`,
  },
  {
    id: 7,
    name: '곡류',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_rice.png`,
  },
  {
    id: 12,
    name: '달걀/유제품',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_dairy.png`,
  },

  {
    id: 4,
    name: '밀가루',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_flour.png`,
  },
];
