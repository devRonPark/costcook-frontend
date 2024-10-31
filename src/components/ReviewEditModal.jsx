import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Star } from '@mui/icons-material';

const ReviewEditModal = ({ review, isOpen, onChange, onClose, onSubmit }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle style={{ textAlign: 'center' }}>리뷰 작성</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '10px',
            width: '300px',
          }}
        >
          {Array(5)
            .fill()
            .map((_, index) => (
              <Star
                key={index}
                onClick={() => onChange('score', index + 1)}
                style={{
                  cursor: 'pointer',
                  color: index < review.score ? 'gold' : 'lightgray',
                  fontSize: '20px',
                  marginRight: '2px',
                }}
              />
            ))}
        </div>
        <textarea
          type="text"
          value={review.comment}
          onChange={(e) => onChange('comment', e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ced4da',
            marginBottom: '10px',
          }}
          placeholder={'리뷰를 작성해주세요.'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          취소
        </Button>
        <Button onClick={onSubmit} color="primary" variant="contained">
          {'등록'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewEditModal;
