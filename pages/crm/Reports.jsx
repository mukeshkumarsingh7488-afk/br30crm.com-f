import OperationsPage from "./OperationsPage";
import { createReport, deleteReport, getReports } from "../../api/operations.api";
export default function Reports() {
  return (
    <OperationsPage
      config={{
        title: "Reports",
        singular: "Report",
        list: getReports,
        create: createReport,
        remove: deleteReport,
        fields: [
          { name: "name", label: "Report name" },
          { name: "source", label: "Source" },
        ],
        columns: [
          { key: "name", label: "Report" },
          { key: "source", label: "Source" },
          { key: "createdAt", label: "Created" },
        ],
      }}
    />
  );
}
