import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 1 }} // 화면 오른쪽 밖에서 시작 (100% 위치)
      animate={{ x: 0, opacity: 1 }} // 중앙으로 슬라이드하며 등장
      exit={{ x: '-100%', opacity: 1 }} // 화면 왼쪽으로 슬라이드하며 퇴장
      transition={{ duration: 0.3, ease: 'easeInOut' }} // 자연스러운 애니메이션 (0.3초, 점진적 시작/종료)
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
