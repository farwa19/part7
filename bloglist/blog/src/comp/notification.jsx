import { Alert } from "@mui/material";
import { NotificationStore } from "./store";

export const Notification = () => {
  const message = NotificationStore((state) => state.message);
  const type = NotificationStore((state) => state.type);
  const clearNotification = NotificationStore((state) => state.clearNotification);

  if (!message || type === "error") {
    return null;
  }

  return (
    <Alert severity={type === "success" ? "success" : "info"} onClose={clearNotification}>
      {message}
    </Alert>
  );
};

export const ErrorNotification = () => {
  const message = NotificationStore((state) => state.message);
  const type = NotificationStore((state) => state.type);
  const clearNotification = NotificationStore((state) => state.clearNotification);

  if (!message || type !== "error") {
    return null;
  }

  return (
    <Alert severity="error" onClose={clearNotification}>
      {message}
    </Alert>
  );
};
