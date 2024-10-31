// 최대 저장할 검색어 수
const MAX_RECENT_KEYWORD_COUNT = 10;

// 검색어 로컬 스토리지에 저장
export const saveSearchKeyword = (keyword) => {
  // 로컬 스토리지에서 기존 검색어 리스트 가져오기
  let recentSearches = JSON.parse(localStorage.getItem('recentKeywords')) || [];

  // 중복 검색어 제거
  recentSearches = recentSearches.filter((item) => item !== keyword);

  // 검색어 추가 (맨 앞에 추가)
  recentSearches.unshift(keyword);

  // 최대 저장 개수 초과 시 마지막 검색어 제거
  if (recentSearches.length > MAX_RECENT_KEYWORD_COUNT) {
    recentSearches.pop();
  }

  // 로컬 스토리지에 저장
  localStorage.setItem('recentKeywords', JSON.stringify(recentSearches));
};

// 최근 검색어 불러오기
export const getRecentKeywords = () => {
  return JSON.parse(localStorage.getItem('recentKeywords')) || [];
};

// 특정 검색어 삭제
export const deleteSearchKeyword = (keyword) => {
  let recentSearches = JSON.parse(localStorage.getItem('recentKeywords')) || [];
  recentSearches = recentSearches.filter((item) => item !== keyword);
  localStorage.setItem('recentKeywords', JSON.stringify(recentSearches));
};

// 모든 검색어 삭제
export const clearAllSearchKeywords = () => {
  localStorage.removeItem('recentKeywords');
};
