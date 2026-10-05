import OperationsPage from "./OperationsPage";
import { getAuditLogs } from "../../api/audit.api";
export default function AuditLog(){return <OperationsPage config={{title:"Audit Log",singular:"Log",list:getAuditLogs,columns:[{key:"action",label:"Action"},{key:"module",label:"Module"},{key:"entityType",label:"Entity"},{key:"severity",label:"Severity"},{key:"status",label:"Status"},{key:"createdAt",label:"Date",render:r=>r.createdAt?new Date(r.createdAt).toLocaleString("en-IN"):"—"},{key:"actorId",label:"User",render:r=>r.actorId?.name||r.actorId?.email||"System"}]}}/>}
