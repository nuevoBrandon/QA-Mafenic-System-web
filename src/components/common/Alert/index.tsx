import { Snackbar, Alert, AlertColor } from "@mui/material";

interface Props {
  open: boolean;
  handleClose: () => void;
  message: string;
  color: AlertColor; // "success" | "info" | "warning" | "error"
}

export default function AlertSanck({
  open,
  handleClose,
  message,
  color,
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // opcional
    >
      <Alert
        onClose={handleClose}
        severity={color}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
