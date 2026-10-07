import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../../api/api";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getPublicFormWithRetry = async ({ businessId, slug, query }) => {
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await api.get(`/public-forms/public/${businessId}/${encodeURIComponent(slug)}`, {
        params: query,
        timeout: 90000,
      });
    } catch (error) {
      lastError = error;

      if (attempt === 0) {
        await sleep(1000);
      }
    }
  }

  throw lastError;
};

const unwrap = (response) => response?.data?.data ?? response?.data ?? response ?? {};

const getErrorMessage = (error) => error?.response?.data?.message || error?.response?.data?.error || error?.message || "Unable to load the form.";

const normalizeFieldValue = (value) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const getInitialValues = (fields = []) => {
  const values = {};

  fields.forEach((field) => {
    if (field?.key) {
      values[field.key] = "";
    }
  });

  return values;
};

const getFieldType = (type) => {
  if (type === "email") return "email";
  if (type === "phone") return "tel";
  if (type === "number") return "number";
  if (type === "date") return "date";
  return "text";
};

export default function PublicForm() {
  const { businessId, slug } = useParams();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const query = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const tracking = useMemo(() => {
    return {
      query,
      utm: {
        source: query.utm_source || null,
        medium: query.utm_medium || null,
        campaign: query.utm_campaign || null,
        term: query.utm_term || null,
        content: query.utm_content || null,
      },
      referrer: document.referrer || null,
      origin: window.location.origin,
      landingPage: window.location.href,
      userAgent: navigator.userAgent,
    };
  }, [query]);

  useEffect(() => {
    let mounted = true;

    const loadForm = async () => {
      if (!businessId || !slug) {
        setError("Invalid public form URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await getPublicFormWithRetry({
          businessId,
          slug,
          query,
        });

        const data = unwrap(response);

        if (!mounted) return;

        const fields = Array.isArray(data?.fields) ? data.fields : [];

        setForm(data);
        setValues(getInitialValues(fields));
      } catch (err) {
        if (!mounted) return;
        setError(getErrorMessage(err));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadForm();

    return () => {
      mounted = false;
    };
  }, [businessId, slug, query]);

  const handleChange = (field, value) => {
    setValues((previous) => ({
      ...previous,
      [field.key]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!businessId || !slug || !form) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...values,

        _website: "",
      };

      const response = await api.post(`/public-forms/public/${businessId}/${encodeURIComponent(slug)}/submit`, payload, {
        params: query,
      });
      const result = unwrap(response);

      if (result?.redirectUrl) {
        window.location.assign(result.redirectUrl);
        return;
      }

      setSuccess(
        result?.supportTicket?.ticketNumber ? `${result?.successMessage || form?.successMessage || "Your support request has been submitted successfully."} Ticket ID: ${result.supportTicket.ticketNumber}` : result?.successMessage || form?.successMessage || "Thank you. We will contact you shortly."
      );

      setValues(getInitialValues(form.fields));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    if (!field?.key) return null;

    const value = normalizeFieldValue(values[field.key]);

    const commonProps = {
      id: field.key,
      name: field.key,
      value,
      required: Boolean(field.required),
      placeholder: field.placeholder || "",
      disabled: submitting,
      onChange: (event) => handleChange(field, event.target.value),
    };

    return (
      <div className="public-form-field" key={field.key}>
        <label className="public-form-label" htmlFor={field.key}>
          {field.label || field.key}
          {field.required ? <span className="public-form-required">*</span> : null}
        </label>

        {field.helpText ? <div className="public-form-help">{field.helpText}</div> : null}

        {field.type === "textarea" ? (
          <textarea {...commonProps} className="public-form-control public-form-textarea" rows={5} />
        ) : field.type === "select" ? (
          <select {...commonProps} className="public-form-control">
            <option value="">{field.placeholder || `Select ${field.label || "an option"}`}</option>

            {(Array.isArray(field.options) ? field.options : []).map((option, index) => (
              <option key={`${field.key}-${index}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input {...commonProps} type={getFieldType(field.type)} className="public-form-control" />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="public-form-page">
        <div className="public-form-shell public-form-state">
          <div className="public-form-spinner" />
          <p>Loading form...</p>
        </div>

        <style>{`
          .public-form-page{min-height:100vh;background:#f6f8fb;color:#172033;display:flex;align-items:center;justify-content:center;padding:32px 18px;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-sizing:border-box}
          .public-form-shell{width:100%;max-width:680px}
          .public-form-state{min-height:240px;background:#fff;border:1px solid #e5e9f0;border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;box-shadow:0 10px 35px rgba(20,30,50,.06)}
          .public-form-state p{margin:0;color:#687386;font-size:14px}
          .public-form-spinner{width:30px;height:30px;border:3px solid #e3e8ef;border-top-color:#2563eb;border-radius:50%;animation:publicFormSpin .8s linear infinite}
          @keyframes publicFormSpin{to{transform:rotate(360deg)}}
        `}</style>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="public-form-page">
        <div className="public-form-shell public-form-state">
          <div className="public-form-error-icon">!</div>
          <h2>Unable to open form</h2>
          <p>{error}</p>
        </div>

        <style>{`
          .public-form-page{min-height:100vh;background:#f6f8fb;color:#172033;display:flex;align-items:center;justify-content:center;padding:32px 18px;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-sizing:border-box}
          .public-form-shell{width:100%;max-width:680px}
          .public-form-state{min-height:240px;background:#fff;border:1px solid #e5e9f0;border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:30px;box-shadow:0 10px 35px rgba(20,30,50,.06);box-sizing:border-box}
          .public-form-state h2{margin:0;font-size:22px}
          .public-form-state p{margin:0;color:#687386;font-size:14px;max-width:500px;line-height:1.6}
          .public-form-error-icon{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fee2e2;color:#dc2626;font-weight:800;font-size:20px}
        `}</style>
      </div>
    );
  }

  if (success) {
    return (
      <div className="public-form-page">
        <div className="public-form-shell public-form-card public-form-success-card">
          <div className="public-form-success-icon">✓</div>

          <h1>{form?.purpose === "SUPPORT" ? "Support request submitted" : "Thank you!"}</h1>

          <p>{success}</p>
        </div>

        <style>{`
          .public-form-page{min-height:100vh;background:#f6f8fb;color:#172033;display:flex;align-items:center;justify-content:center;padding:32px 18px;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-sizing:border-box}
          .public-form-shell{width:100%;max-width:680px}
          .public-form-card{background:#fff;border:1px solid #e5e9f0;border-radius:20px;box-shadow:0 12px 40px rgba(20,30,50,.07);box-sizing:border-box}
          .public-form-success-card{min-height:300px;padding:42px 30px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
          .public-form-success-icon{width:62px;height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#dcfce7;color:#16a34a;font-size:30px;font-weight:800;margin-bottom:20px}
          .public-form-success-card h1{margin:0 0 10px;font-size:28px}
          .public-form-success-card p{margin:0;color:#687386;line-height:1.7;max-width:500px;font-size:15px}
        `}</style>
      </div>
    );
  }

  const fields = Array.isArray(form?.fields) ? form.fields : [];

  return (
    <div className="public-form-page">
      <main className="public-form-shell">
        <section className="public-form-card">
          <div className="public-form-header">
            <div className="public-form-brand-mark">{form?.businessName || "Contact"}</div>

            <h1>{form?.name || (form?.purpose === "SUPPORT" ? "Create Support Ticket" : "Contact Form")}</h1>

            {form?.description ? <p>{form.description}</p> : <p>{form?.purpose === "SUPPORT" ? "Tell us what you need help with and our support team will take it from there." : "Please fill out the form below."}</p>}
          </div>

          {error ? <div className="public-form-alert public-form-alert-error">{error}</div> : null}

          <form onSubmit={handleSubmit} className="public-form-body">
            {fields.length ? (
              fields
                .slice()
                .sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0))
                .map(renderField)
            ) : (
              <div className="public-form-empty">This form does not have any fields configured.</div>
            )}

            <input type="text" name="_website" value="" onChange={() => {}} tabIndex="-1" autoComplete="off" aria-hidden="true" className="public-form-honeypot" />

            <button type="submit" className="public-form-submit" disabled={submitting || !fields.length}>
              {submitting ? "Submitting..." : form?.purpose === "SUPPORT" ? "Create Support Ticket" : "Submit"}
            </button>

            {form?.spamProtection ? <div className="public-form-privacy">Your information is protected and will only be used to respond to your enquiry.</div> : null}
          </form>
        </section>
      </main>

      <style>{`
        *{box-sizing:border-box}
        .public-form-page{min-height:100vh;background:#f6f8fb;color:#172033;padding:40px 18px;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .public-form-shell{width:100%;max-width:680px;margin:0 auto}
        .public-form-card{background:#fff;border:1px solid #e5e9f0;border-radius:20px;box-shadow:0 12px 40px rgba(20,30,50,.07);overflow:hidden}
        .public-form-header{padding:34px 34px 28px;border-bottom:1px solid #edf0f4}
        .public-form-brand-mark{display:inline-flex;align-items:center;justify-content:center;height:32px;padding:0 12px;border-radius:9px;background:#172033;color:#fff;font-size:12px;font-weight:800;letter-spacing:.5px;margin-bottom:18px}
        .public-form-header h1{margin:0;font-size:28px;line-height:1.25;font-weight:700;letter-spacing:-.3px;color:#172033}
        .public-form-header p{margin:10px 0 0;color:#687386;font-size:14px;line-height:1.7}
        .public-form-body{padding:30px 34px 34px}
        .public-form-field{margin-bottom:21px}
        .public-form-label{display:block;margin-bottom:8px;color:#263246;font-size:13px;font-weight:600;line-height:1.4}
        .public-form-required{color:#dc2626;margin-left:4px}
        .public-form-help{margin:-2px 0 8px;color:#8791a1;font-size:12px;line-height:1.5}
        .public-form-control{display:block;width:100%;min-height:46px;border:1px solid #dce2ea;border-radius:10px;background:#fff;color:#172033;padding:11px 13px;font:inherit;font-size:14px;outline:none;transition:border-color .18s ease,box-shadow .18s ease,background .18s ease}
        .public-form-control::placeholder{color:#a1a9b6}
        .public-form-control:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}
        .public-form-control:disabled{background:#f7f8fa;cursor:not-allowed}
        .public-form-textarea{min-height:120px;resize:vertical;line-height:1.55}
        select.public-form-control{cursor:pointer}
        .public-form-submit{width:100%;min-height:48px;border:0;border-radius:10px;background:#2563eb;color:#fff;font:inherit;font-size:14px;font-weight:700;cursor:pointer;transition:transform .15s ease,opacity .15s ease,box-shadow .15s ease;box-shadow:0 5px 16px rgba(37,99,235,.2)}
        .public-form-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 20px rgba(37,99,235,.24)}
        .public-form-submit:disabled{opacity:.65;cursor:not-allowed;box-shadow:none}
        .public-form-alert{margin:22px 34px 0;padding:12px 14px;border-radius:10px;font-size:13px;line-height:1.5}
        .public-form-alert-error{background:#fef2f2;border:1px solid #fecaca;color:#b91c1c}
        .public-form-empty{padding:18px;border-radius:10px;background:#f8fafc;border:1px dashed #dce2ea;color:#687386;text-align:center;font-size:13px;margin-bottom:20px}
        .public-form-privacy{text-align:center;color:#8a94a3;font-size:11px;line-height:1.5;margin-top:14px}
        .public-form-honeypot{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
        @media(max-width:640px){
          .public-form-page{padding:18px 12px}
          .public-form-header{padding:26px 20px 22px}
          .public-form-body{padding:24px 20px 26px}
          .public-form-header h1{font-size:24px}
          .public-form-alert{margin-left:20px;margin-right:20px}
        }
      `}</style>
    </div>
  );
}
