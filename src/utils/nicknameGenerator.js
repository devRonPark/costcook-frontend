import { adjectives, nouns, numbers, specialCharacters } from './nicknameData';

export function generateRandomNickname() {
  // 형용사, 명사, 숫자, 특수문자 랜덤 선택
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
  const randomSpecialChar =
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  // 닉네임 형성 방식 (형용사 + 명사 + 숫자 + 특수문자)
  const nickname = `${randomAdjective}${randomNoun}${randomNumber}${randomSpecialChar}`;
  return nickname;
}
