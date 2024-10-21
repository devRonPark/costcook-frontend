import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from './IconButton';

const DeleteButton = ({ onClick }) => (
  <IconButton onClick={onClick} IconComponent={DeleteIcon} />
);

export default DeleteButton;
