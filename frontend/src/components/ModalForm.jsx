import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ModalForm = ({
  open, onClose, title, children, onSubmit,
  submitLabel = 'Save', loading = false, maxWidth = 'sm',
}) => (
  <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {title}
      <IconButton onClick={onClose} size="small">
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <Box component="form" onSubmit={onSubmit}>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </DialogActions>
    </Box>
  </Dialog>
);

export default ModalForm;
