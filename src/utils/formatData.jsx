// 숫자 쉼표 표기 (1000 -> 1,000)
export const formatPrice = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 1천(k), 1백만(M) 표기
export const formatFavoriteCount = (count) => {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M` // 100만 이상 M표기 (소수점 1자리까지)
    } else if (count >= 1000) {
        return `${(count /1000).toFixed(1)}k` // 1000 이상 k표기 (소수점 1자리까지)
    } else {
        return count.toString();
    }
}
