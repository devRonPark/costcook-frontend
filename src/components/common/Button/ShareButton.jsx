import ShareIcon from '@mui/icons-material/Share'; // 공유 아이콘
import IconButton from './IconButton'; // IconButton 가져오기

const ShareButton = ({ onClick }) => {
  const iconStyle = {
    color: 'blue', // 아이콘 색상 설정
    fontSize: '30px', // 다른 아이콘 크기 설정 가능
  };

  return (
    <IconButton
      onClick={onClick}
      IconComponent={ShareIcon}
      iconStyle={iconStyle}
    />
  );
};

export default ShareButton;
