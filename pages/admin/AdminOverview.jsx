import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Activity, ArrowUpRight, Database, RefreshCw, ShieldCheck, Users, BriefcaseBusiness, Building2 } from "lucide-react";

function AdminOverview() {
  const { overview, reloadOverview } = useOutletContext();
  const data = useMemo(() => {
    const stats = overview?.stats || {};
    const users = stats.users || {};

    return {
      totalUsers: users.total ?? 0,
      activeUsers: users.active ?? 0,
      totalBusinesses: stats.businesses ?? 0,
      totalMembers: 0,
      totalLeads: stats.leads ?? 0,
      totalContacts: stats.contacts ?? 0,
      totalDeals: stats.deals ?? 0,
      totalActivities: 0,
      recentUsers: Array.isArray(users.list) ? users.list : [],
      recentBusinesses: [],
      system: overview?.system || {},
    };
  }, [overview]);

  const cards = [
    { label: "Total Users", value: data.totalUsers, icon: Users },
    { label: "Active Users", value: data.activeUsers, icon: Activity },
    { label: "Businesses", value: data.totalBusinesses, icon: Building2 },
    { label: "Business Members", value: data.totalMembers, icon: BriefcaseBusiness },
    { label: "Leads", value: data.totalLeads, icon: Database },
    { label: "Contacts", value: data.totalContacts, icon: Users },
    { label: "Deals", value: data.totalDeals, icon: ArrowUpRight },
    { label: "Activities", value: data.totalActivities, icon: Activity },
  ];

  return (
    <div className="admin-overview-page">
      <div className="admin-overview-header">
        <div>
          <div className="admin-overview-eyebrow">
            <ShieldCheck size={15} />
            MASTER ADMIN
          </div>
          <h1>Admin Overview</h1>
          <p>System-wide control center for BR30 CRM.</p>
        </div>

        <button type="button" className="admin-overview-refresh" onClick={reloadOverview}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <section className="admin-stat-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article className="admin-stat-card" key={card.label}>
              <div className="admin-stat-icon">
                <Icon size={19} />
              </div>
              <div className="admin-stat-info">
                <span>{card.label}</span>
                <strong>{Number(card.value || 0).toLocaleString("en-IN")}</strong>
              </div>
            </article>
          );
        })}
      </section>

      <section className="admin-overview-grid">
        <article className="admin-panel-card">
          <div className="admin-panel-card-header">
            <div>
              <h2>System Status</h2>
              <p>Current platform information</p>
            </div>
            <span className="admin-status-online">
              <i />
              Online
            </span>
          </div>

          <div className="admin-system-list">
            <div>
              <span>Environment</span>
              <strong>{data.system.environment || "—"}</strong>
            </div>

            <div>
              <span>Node Environment</span>
              <strong>{data.system.nodeEnv || "—"}</strong>
            </div>

            <div>
              <span>API Status</span>
              <strong>{data.system.status || "Operational"}</strong>
            </div>

            <div>
              <span>Server Time</span>
              <strong>{data.system.timestamp ? new Date(data.system.timestamp).toLocaleString("en-IN") : "—"}</strong>
            </div>
          </div>
        </article>

        <article className="admin-panel-card">
          <div className="admin-panel-card-header">
            <div>
              <h2>Master Admin</h2>
              <p>Current authorization level</p>
            </div>
            <ShieldCheck size={21} />
          </div>

          <div className="admin-master-box">
            <div className="admin-master-icon">
              <ShieldCheck size={26} />
            </div>
            <div>
              <strong>Full System Access</strong>
              <span>Master Admin authorization verified by backend.</span>
            </div>
          </div>
        </article>
      </section>

      <section className="admin-panel-card admin-table-card">
        <div className="admin-panel-card-header">
          <div>
            <h2>Recent Users</h2>
            <p>Latest registered CRM users</p>
          </div>
        </div>

        {data.recentUsers.length === 0 ? (
          <div className="admin-empty-state">
            <Users size={25} />
            <span>No recent user data available.</span>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {data.recentUsers.slice(0, 10).map((user, index) => (
                  <tr key={user._id || user.id || user.email || index}>
                    <td>{user.name || "—"}</td>
                    <td>{user.email || "—"}</td>
                    <td>
                      <span className={`admin-user-status ${String(user.status || "ACTIVE").toLowerCase()}`}>{user.status || "ACTIVE"}</span>
                    </td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <style>{`.admin-overview-page{width:100%;max-width:1500px;margin:0 auto;padding:28px 28px 45px;box-sizing:border-box}.admin-overview-header{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:25px}.admin-overview-eyebrow{display:flex;align-items:center;gap:6px;color:var(--admin-primary);font-size:13px;font-weight:400;letter-spacing:.08em;margin-bottom:7px}.admin-overview-header h1{margin:0;font-size:29px;line-height:1.2}.admin-overview-header p{margin:7px 0 0;color:var(--admin-muted);font-size:14px}.admin-overview-refresh{height:40px;padding:0 14px;border:1px solid var(--admin-border);border-radius:9px;background:var(--admin-surface);color:var(--admin-text);display:flex;align-items:center;gap:7px;font-weight:400;cursor:pointer}.admin-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px;margin-bottom:20px}.admin-stat-card{min-width:0;padding:18px;border:1px solid var(--admin-border);border-radius:13px;background:var(--admin-surface);display:flex;align-items:center;gap:13px;box-sizing:border-box}.admin-stat-icon{width:42px;height:42px;flex:0 0 42px;border-radius:11px;background:var(--admin-surface-2);color:var(--admin-primary);display:flex;align-items:center;justify-content:center}.admin-stat-info{min-width:0}.admin-stat-info span{display:block;color:var(--admin-muted);font-size:13px;margin-bottom:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.admin-stat-info strong{display:block;font-size:23px;line-height:1.1}.admin-overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}.admin-panel-card{border:1px solid var(--admin-border);border-radius:13px;background:var(--admin-surface);overflow:hidden}.admin-panel-card-header{min-height:72px;padding:16px 18px;border-bottom:1px solid var(--admin-border);display:flex;align-items:center;justify-content:space-between;gap:15px;box-sizing:border-box}.admin-panel-card-header h2{margin:0;font-size:16px}.admin-panel-card-header p{margin:4px 0 0;font-size:13px;color:var(--admin-muted)}.admin-status-online{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:400;color:var(--admin-success)}.admin-status-online i{width:7px;height:7px;border-radius:50%;background:var(--admin-success)}.admin-system-list{padding:5px 18px}.admin-system-list div{min-height:43px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid var(--admin-border);font-size:13px}.admin-system-list div:last-child{border-bottom:0}.admin-system-list span{color:var(--admin-muted)}.admin-system-list strong{font-weight:400;text-align:right}.admin-master-box{padding:25px 18px;display:flex;align-items:center;gap:15px}.admin-master-icon{width:52px;height:52px;flex:0 0 52px;border-radius:14px;background:var(--admin-success-bg);color:var(--admin-success);display:flex;align-items:center;justify-content:center}.admin-master-box strong{display:block;font-size:15px}.admin-master-box span{display:block;color:var(--admin-muted);font-size:13px;line-height:1.5;margin-top:5px}.admin-table-card{margin-bottom:20px}.admin-table-wrap{width:100%;overflow-x:auto}.admin-table{width:100%;border-collapse:collapse;min-width:650px}.admin-table th,.admin-table td{padding:13px 18px;text-align:left;border-bottom:1px solid var(--admin-border);font-size:13px}.admin-table th{font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--admin-muted);font-weight:400;background:var(--admin-surface-2)}.admin-table td{color:var(--admin-text)}.admin-table tbody tr:last-child td{border-bottom:0}.admin-user-status{display:inline-flex;padding:4px 8px;border-radius:999px;font-size:13px;font-weight:400}.admin-user-status.active{background:var(--admin-success-bg);color:var(--admin-success)}.admin-user-status.inactive{background:var(--admin-warning-bg);color:var(--admin-warning)}.admin-user-status.suspended{background:var(--admin-danger-bg);color:var(--admin-danger)}.admin-empty-state{min-height:170px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:9px;color:var(--admin-muted);font-size:13px}.admin-empty-state svg{opacity:.65}@media(max-width:1100px){.admin-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:800px){.admin-overview-grid{grid-template-columns:1fr}}@media(max-width:600px){.admin-overview-page{padding:20px 14px 35px}.admin-overview-header{align-items:flex-start;flex-direction:column}.admin-overview-header h1{font-size:25px}.admin-overview-refresh{width:100%;justify-content:center}.admin-stat-grid{grid-template-columns:1fr 1fr;gap:10px}.admin-stat-card{padding:13px}.admin-stat-icon{width:37px;height:37px;flex-basis:37px}.admin-stat-info strong{font-size:19px}}@media(max-width:400px){.admin-stat-grid{grid-template-columns:1fr}}`}</style>
    </div>
  );
}

export default AdminOverview;
