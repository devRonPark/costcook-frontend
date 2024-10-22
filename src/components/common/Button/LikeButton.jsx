import FavoriteIcon from '@mui/icons-material/Favorite'; // 좋아요 아이콘
import IconButton from './IconButton'; // IconButton 가져오기

const LikeButton = ({ onClick }) => {
  const iconStyle = {
    color: 'red', // 아이콘 색상 설정
    fontSize: '32px', // 다른 아이콘 크기 설정 가능
  };

  return (
    <IconButton
      onClick={onClick}
      IconComponent={FavoriteIcon}
      iconStyle={iconStyle}
    />
  );
};

export default LikeButton;
