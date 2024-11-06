import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const LoginModal = ({ isOpen, onClose, onConfirm }) => (
  <Dialog open={isOpen} onClose={onClose}>
    <DialogTitle>로그인이 필요합니다.</DialogTitle>
    <DialogContent>
      <DialogContentText>로그인하시겠습니까?</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        취소
      </Button>
      <Button onClick={onConfirm} color="primary">
        확인
      </Button>
    </DialogActions>
  </Dialog>
);

export default LoginModal;
