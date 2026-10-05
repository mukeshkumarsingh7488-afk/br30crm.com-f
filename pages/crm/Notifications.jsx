import OperationsPage from "./OperationsPage";
import { deleteNotification, getNotifications, markNotificationRead } from "../../api/operations.api";
export default function Notifications() {
  return (
    <OperationsPage
      config={{
        title: "Notifications",
        singular: "Notification",
        list: getNotifications,
        remove: deleteNotification,
        markRead: markNotificationRead,
        columns: [
          { key: "title", label: "Title" },
          { key: "type", label: "Type" },
          { key: "priority", label: "Priority" },
          { key: "status", label: "Status" },
        ],
      }}
    />
  );
}
