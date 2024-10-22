import FilterListIcon from '@mui/icons-material/FilterList'; // 필터 아이콘
import IconButton from './IconButton'; // IconButton 가져오기

const FilterButton = ({ onClick }) => {
  const iconStyle = {
    color: 'green', // 아이콘 색상 설정
    fontSize: '32px', // 다른 아이콘 크기 설정 가능
  };

  return (
    <IconButton
      onClick={onClick}
      IconComponent={FilterListIcon}
      iconStyle={iconStyle}
    />
  );
};

export default FilterButton;
