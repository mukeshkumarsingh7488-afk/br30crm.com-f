import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, RefreshCw, ShieldCheck } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { getCurrentSubscription, getPaymentStatus, getSubscriptionPlans, startSubscriptionCheckout } from "../../api/subscription.api";
import { showAuthAlert } from "../../components/auth/authAlert";
export default function Subscription() {
  const { businessId } = useBusiness();
  const [plans, setPlans] = useState([]),
    [current, setCurrent] = useState(null),
    [cycle, setCycle] = useState("MONTHLY"),
    [loading, setLoading] = useState(true),
    [paying, setPaying] = useState("");
  useEffect(() => {
    Promise.all([getSubscriptionPlans(), businessId ? getCurrentSubscription(businessId) : Promise.resolve(null)])
      .then(([p, c]) => {
        setPlans(Array.isArray(p) ? p : []);
        setCurrent(c);
      })
      .finally(() => setLoading(false));
  }, [businessId]);
  const pay = async (plan) => {
    if (plan.monthly === 0) return;
    setPaying(plan.id);
    try {
      const r = await startSubscriptionCheckout(businessId, { plan: plan.id, billingCycle: cycle });
      if (r.free) {
        await showAuthAlert({ icon: "success", title: "Plan activated", text: "Your free plan is active.", confirmButtonText: "Done" });
        return;
      }
      if (window.Paytm?.CheckoutJS) {
        const script = document.createElement("script");
        script.src = `${r.host}/merchantpgpui/checkoutjs/merchants/${r.mid}.js`;
        script.onload = () =>
          window.Paytm.CheckoutJS.onLoad(() =>
            window.Paytm.CheckoutJS.init({
              root: "#paytm-checkout",
              flow: "DEFAULT",
              data: { orderId: r.orderId, token: r.txnToken, tokenType: "TXN_TOKEN", amount: r.amount },
              handler: {
                notifyMerchant: async () => {
                  try {
                    const updated = await getPaymentStatus(businessId, r.orderId);
                    setCurrent(updated.subscription || current);
                  } catch {}
                },
              },
            }).then(() => window.Paytm.CheckoutJS.invoke())
          );
        document.body.appendChild(script);
      } else await showAuthAlert({ icon: "info", title: "Paytm checkout ready", text: `Order ${r.orderId} is ready. Load the Paytm CheckoutJS script to continue.`, confirmButtonText: "OK" });
    } catch (e) {
      showAuthAlert({ icon: "error", title: "Payment failed", text: e?.response?.data?.message || e?.message || "Unable to start payment.", confirmButtonText: "OK" });
    } finally {
      setPaying("");
    }
  };
  return (
    <div className="sub-page">
      <style>{`.sub-page{padding:24px 26px 40px;max-width:1400px;margin:auto;color:var(--crm-text)}.sub-head{display:flex;justify-content:space-between;gap:14px;margin-bottom:18px}.sub-title{font-size:24px;font-weight:400;margin:0}.sub-sub{font-size:13px;color:var(--crm-muted);margin:5px 0}.sub-current{border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);padding:15px;box-shadow:var(--crm-shadow);margin-bottom:16px}.sub-plans{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.sub-card{border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);padding:17px;box-shadow:var(--crm-shadow)}.sub-card.current{border-color:var(--crm-primary);box-shadow:0 0 0 1px var(--crm-primary)}.sub-card h3{margin:0;font-size:16px;font-weight:500}.sub-price{font-size:25px;margin:13px 0}.sub-muted{font-size:12px;color:var(--crm-muted)}.sub-btn{margin-top:14px;width:100%;height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text)}.sub-btn.primary{background:var(--crm-primary);color:#fff;border-color:var(--crm-primary)}.sub-cycle{height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 10px}#paytm-checkout{min-height:1px}@media(max-width:1000px){.sub-plans{grid-template-columns:1fr 1fr}}@media(max-width:600px){.sub-page{padding:18px 14px}.sub-head{flex-direction:column}.sub-plans{grid-template-columns:1fr}}`}</style>
      <div className="sub-head">
        <div>
          <h1 className="sub-title">Subscription & Billing</h1>
          <p className="sub-sub">Manage BR30 CRM plan, billing cycle and Paytm checkout.</p>
        </div>
        <select className="sub-cycle" value={cycle} onChange={(e) => setCycle(e.target.value)}>
          <option>MONTHLY</option>
          <option>YEARLY</option>
        </select>
      </div>
      {current && (
        <div className="sub-current">
          <strong>Current plan: {current.plan}</strong>
          <div className="sub-muted">
            Status: {current.status} · Billing: {current.billingCycle} · Ends: {current.endsAt ? new Date(current.endsAt).toLocaleDateString("en-IN") : "—"}
          </div>
        </div>
      )}
      <div className="sub-plans">
        {loading ? (
          <div>Loading plans…</div>
        ) : (
          plans.map((p) => (
            <div className={`sub-card ${current?.plan === p.id ? "current" : ""}`} key={p.id}>
              <h3>{p.name}</h3>
              <div className="sub-price">
                ₹{cycle === "YEARLY" ? p.yearly : p.monthly}
                <span className="sub-muted"> / {cycle.toLowerCase()}</span>
              </div>
              <div className="sub-muted">
                <CheckCircle2 size={13} /> Secure checkout
              </div>
              <div className="sub-muted" style={{ marginTop: 7 }}>
                <ShieldCheck size={13} /> Business-level access controls
              </div>
              <button className={`sub-btn ${current?.plan === p.id ? "" : "primary"}`} disabled={current?.plan === p.id || paying === p.id} onClick={() => pay(p)}>
                {current?.plan === p.id ? "Current plan" : paying === p.id ? "Preparing checkout…" : p.monthly === 0 ? "Activate free" : "Choose plan"}
              </button>
            </div>
          ))
        )}
      </div>
      <div id="paytm-checkout" />
    </div>
  );
}
