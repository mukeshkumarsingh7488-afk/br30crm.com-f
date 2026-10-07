import { useEffect, useRef, useState } from "react";

import { ArrowLeft, Building2, BriefcaseBusiness, CalendarDays, Camera, Check, CheckCircle2, ChevronDown, ChevronUp, Clock3, Copy, Edit3, Globe2, Image as ImageIcon, Loader2, Mail, MapPin, Phone, Save, ShieldCheck, User, WalletCards, X } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getCurrentUser, updateProfile, removeProfileImage } from "../../api/auth";

import { getBusinessById } from "../../api/business.api";

import { getMembers } from "../../api/member.api";

import { showAuthSuccess, showAuthError, showAuthWarning } from "../../components/auth/authAlert";

import useBusiness from "../../hooks/useBusiness";

function MyProfile() {
  const navigate = useNavigate();

  const { businessId, business } = useBusiness();

  const [businessDetails, setBusinessDetails] = useState(null);
  const [businessExpanded, setBusinessExpanded] = useState(false);
  const [businessForm, setBusinessForm] = useState({ name: "", legalName: "", businessType: "", industry: "", description: "", website: "", address: { line1: "", line2: "", city: "", state: "", postalCode: "", country: "" } });
  const [businessSaving, setBusinessSaving] = useState(false);

  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",

    email: "",

    phone: "",

    profileImage: "",

    profileImagePublicId: "",
  });

  const [originalForm, setOriginalForm] = useState({
    name: "",

    email: "",

    phone: "",

    profileImage: "",

    profileImagePublicId: "",
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [removing, setRemoving] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [message, setMessage] = useState({
    type: "",

    text: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  const isBusinessOwner = Boolean(user?._id && businessDetails?.ownerId && String(user._id) === String(businessDetails.ownerId));

  useEffect(() => {
    if (!businessId) return;
    loadProfile();
  }, [businessId]);

  useEffect(() => {
    if (!businessId || !user?._id) return;

    if (String(business?.ownerId || "") !== String(user._id)) {
      setBusinessDetails(null);
      return;
    }

    getBusinessById(businessId)
      .then((response) => {
        const details = response?.data?.business || response?.business || response?.data || response || null;

        setBusinessDetails(details);

        setBusinessForm({
          name: details?.name || "",
          legalName: details?.legalName || user?.name || "",
          businessType: details?.businessType || "",
          industry: details?.industry || "",
          description: details?.description || "",
          website: details?.website || "",
          address: {
            line1: details?.address?.line1 || "",
            line2: details?.address?.line2 || "",
            city: details?.address?.city || "",
            state: details?.address?.state || "",
            postalCode: details?.address?.postalCode || "",
            country: details?.address?.country || "",
          },
        });
      })
      .catch(() => setBusinessDetails(null));
  }, [businessId, user?._id, business?.ownerId]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await getCurrentUser();

      const responseUser = response?.data?.user || response?.user || response?.data || null;

      const currentUser = responseUser?.user || responseUser || null;

      if (!currentUser) {
        throw new Error("Unable to load profile.");
      }

      let membershipId = null;

      if (businessId) {
        try {
          const memberResponse = await getMembers(businessId, {
            page: 1,
            limit: 100,
          });

          const memberData = memberResponse?.data || memberResponse || {};

          const members = Array.isArray(memberData?.members) ? memberData.members : Array.isArray(memberData?.items) ? memberData.items : Array.isArray(memberData?.results) ? memberData.results : Array.isArray(memberData) ? memberData : [];

          const currentMember = members.find((member) => {
            const memberUserId = typeof member?.userId === "string" ? member.userId : member?.userId?._id || member?.userId?.id;

            return String(memberUserId || "") === String(currentUser?._id || "");
          });

          membershipId = currentMember?._id || currentMember?.membershipId || null;
        } catch (membershipError) {}
      }

      const profileData = {
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        profileImage: currentUser.profileImage || "",
        profileImagePublicId: currentUser.profileImagePublicId || "",
      };

      const mergedUser = {
        ...currentUser,
        membershipId,
      };

      setUser(mergedUser);

      setForm(profileData);

      setOriginalForm(profileData);

      setImagePreview(profileData.profileImage || "");
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || error.message || "Failed to load profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });

    window.clearTimeout(window.__profileMessageTimer);

    window.__profileMessageTimer = window.setTimeout(() => {
      setMessage({
        type: "",

        text: "",
      });
    }, 4500);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,

      [name]: value,
    }));
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (!parts.length) {
      return "U";
    }

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const formatDate = (value) => {
    if (!value) {
      return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",

      month: "short",

      year: "numeric",
    }).format(date);
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",

      month: "short",

      year: "numeric",

      hour: "2-digit",

      minute: "2-digit",
    }).format(date);
  };

  const handleBusinessChange = (event) => {
    const { name, value } = event.target;
    setBusinessForm((current) => ({ ...current, [name]: value }));
  };

  const handleBusinessAddressChange = (event) => {
    const { name, value } = event.target;
    setBusinessForm((current) => ({ ...current, address: { ...current.address, [name]: value } }));
  };

  const handleBusinessCancel = () => {
    setBusinessForm({
      name: businessDetails?.name || "",
      legalName: businessDetails?.legalName || user?.name || "",
      businessType: businessDetails?.businessType || "",
      industry: businessDetails?.industry || "",
      description: businessDetails?.description || "",
      website: businessDetails?.website || "",
      address: {
        line1: businessDetails?.address?.line1 || "",
        line2: businessDetails?.address?.line2 || "",
        city: businessDetails?.address?.city || "",
        state: businessDetails?.address?.state || "",
        postalCode: businessDetails?.address?.postalCode || "",
        country: businessDetails?.address?.country || "",
      },
    });
  };

  const handleBusinessSave = async () => {
    if (!isBusinessOwner) return showMessage("error", "Only the Business Owner can edit business details.");
    if (!businessId) return showMessage("error", "Business information is not available.");
    if (!businessForm.name.trim()) return showMessage("error", "Business name is required.");
    try {
      setBusinessSaving(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/businesses/${businessId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          name: businessForm.name.trim(),
          legalName: businessForm.legalName.trim() || null,
          businessType: businessForm.businessType.trim() || null,
          industry: businessForm.industry.trim() || null,
          description: businessForm.description.trim() || null,
          website: businessForm.website.trim() || null,
          address: {
            line1: businessForm.address.line1.trim() || null,
            line2: businessForm.address.line2.trim() || null,
            city: businessForm.address.city.trim() || null,
            state: businessForm.address.state.trim() || null,
            postalCode: businessForm.address.postalCode.trim() || null,
            country: businessForm.address.country.trim() || null,
          },
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.success === false) throw new Error(data?.message || data?.error?.message || "Unable to update business details.");
      const updated = data?.data?.business || data?.business || data?.data || data;
      setBusinessDetails((current) => ({ ...(current || {}), ...(updated || {}), address: { ...(current?.address || {}), ...(updated?.address || businessForm.address) } }));
      setBusinessForm((current) => ({ ...current, ...(updated || {}), address: { ...current.address, ...(updated?.address || {}) } }));
      showMessage("success", "Business details saved successfully.");
    } catch (error) {
      showMessage("error", error.message || "Unable to update business details.");
    } finally {
      setBusinessSaving(false);
    }
  };

  const copyValue = async (value, label = "Value") => {
    const text = value === null || value === undefined ? "" : String(value);

    if (!text || text === "—" || text === "Not available") {
      showMessage("error", `${label} is not available to copy.`);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showMessage("success", `${label} copied to clipboard.`);
    } catch {
      showMessage("error", `Unable to copy ${label.toLowerCase()}.`);
    }
  };

  const fetchProfileImageSignature = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile/image-signature`, {
      method: "GET",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Unable to prepare image upload.");
    }

    return data;
  };

  const uploadToCloudinary = (url, formData, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", url);

      xhr.upload.addEventListener("progress", (event) => {
        if (!event.lengthComputable) {
          return;
        }

        const percent = Math.round((event.loaded / event.total) * 100);

        onProgress(percent);
      });

      xhr.addEventListener("load", () => {
        let response = null;

        try {
          response = JSON.parse(xhr.responseText);
        } catch {
          response = null;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(response);

          return;
        }

        reject(new Error(response?.error?.message || "Cloudinary image upload failed."));
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during image upload."));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Image upload was cancelled."));
      });

      xhr.send(formData);
    });
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    event.target.value = "";

    if (!file.type.startsWith("image/")) {
      showMessage("error", "Please select a valid image file.");

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      showMessage("error", "Profile image must be smaller than 5 MB.");

      return;
    }

    const previousImage = form.profileImage;

    const previousPublicId = form.profileImagePublicId;

    const localPreview = URL.createObjectURL(file);

    setImagePreview(localPreview);

    setUploading(true);

    setUploadProgress(5);

    setMessage({
      type: "",

      text: "",
    });

    try {
      const signatureResponse = await fetchProfileImageSignature();

      const signatureData = signatureResponse?.data || signatureResponse?.data?.data || signatureResponse;

      const cloudName = signatureData?.cloudName;

      const apiKey = signatureData?.apiKey;

      const signature = signatureData?.signature;

      const timestamp = signatureData?.timestamp;

      const folder = signatureData?.folder;

      const publicId = signatureData?.publicId;

      const overwrite = signatureData?.overwrite !== undefined ? signatureData.overwrite : true;

      if (!cloudName || !apiKey || !signature || !timestamp || !folder || !publicId) {
        throw new Error("Cloudinary upload configuration is incomplete.");
      }

      setUploadProgress(15);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const formData = new FormData();

      formData.append("file", file);

      formData.append("api_key", apiKey);

      formData.append("timestamp", timestamp);

      formData.append("signature", signature);

      formData.append("folder", folder);

      formData.append("public_id", publicId);

      formData.append("overwrite", overwrite ? "true" : "false");

      const uploadResponse = await uploadToCloudinary(uploadUrl, formData, (progress) => {
        setUploadProgress(15 + Math.round(progress * 0.65));
      });

      const secureUrl = uploadResponse?.secure_url || uploadResponse?.url || "";

      const uploadedPublicId = uploadResponse?.public_id || publicId;

      if (!secureUrl) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      setUploadProgress(85);

      const profileResponse = await updateProfile({
        profileImage: secureUrl,

        profileImagePublicId: uploadedPublicId,
      });

      const responseUser = profileResponse?.data?.user || profileResponse?.user || profileResponse?.data || null;

      const updatedUser = responseUser?.user || responseUser || null;

      const nextImage = updatedUser?.profileImage || secureUrl;

      const nextPublicId = updatedUser?.profileImagePublicId || uploadedPublicId;

      setForm((current) => ({
        ...current,

        profileImage: nextImage,

        profileImagePublicId: nextPublicId,
      }));

      setOriginalForm((current) => ({
        ...current,

        profileImage: nextImage,

        profileImagePublicId: nextPublicId,
      }));

      setImagePreview(nextImage);

      setUser((current) => ({
        ...(current || {}),

        ...(updatedUser || {}),

        profileImage: nextImage,

        profileImagePublicId: nextPublicId,
      }));

      try {
        localStorage.setItem(
          "user",

          JSON.stringify({
            ...(user || {}),

            ...(updatedUser || {}),

            profileImage: nextImage,

            profileImagePublicId: nextPublicId,
          })
        );
      } catch {}

      setUploadProgress(100);

      await showAuthSuccess("Profile Picture Updated", "Your profile picture has been updated successfully.", { timer: 1800, showConfirmButton: false });

      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    } catch (error) {
      setImagePreview(previousImage || "");

      setForm((current) => ({
        ...current,

        profileImage: previousImage || "",

        profileImagePublicId: previousPublicId || "",
      }));

      await showAuthError("Upload Failed", error.message || "Profile image upload failed.");
    } finally {
      setUploading(false);

      window.setTimeout(() => {
        setUploadProgress(0);
      }, 700);
    }
  };

  const handleRemoveImage = async () => {
    if (!form.profileImage && !form.profileImagePublicId) {
      return;
    }

    if (uploading || removing || saving) {
      return;
    }

    const confirmation = await showAuthWarning("Remove profile photo?", "Your current profile photo will be removed. This action cannot be undone.", {
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!confirmation?.isConfirmed) {
      return;
    }

    try {
      setRemoving(true);

      setMessage({
        type: "",

        text: "",
      });

      const response = await removeProfileImage();

      const responseUser = response?.data?.user || response?.user || response?.data || null;

      const updatedUser = responseUser?.user || responseUser || null;

      setForm((current) => ({
        ...current,

        profileImage: "",

        profileImagePublicId: "",
      }));

      setOriginalForm((current) => ({
        ...current,

        profileImage: "",

        profileImagePublicId: "",
      }));

      setImagePreview("");

      setUser((current) => ({
        ...(current || {}),

        ...(updatedUser || {}),

        profileImage: "",

        profileImagePublicId: "",
      }));

      try {
        localStorage.setItem(
          "user",

          JSON.stringify({
            ...(user || {}),

            ...(updatedUser || {}),

            profileImage: "",

            profileImagePublicId: "",
          })
        );
      } catch {}

      await showAuthSuccess("Profile Picture Removed", "Your profile picture has been removed successfully.", { timer: 1800, showConfirmButton: false });
    } catch (error) {
      await showAuthError("Remove Failed", error.message || "Unable to remove profile image.");
    } finally {
      setRemoving(false);
    }
  };

  const hasChanges = form.name !== originalForm.name || form.phone !== originalForm.phone;

  const handleCancel = () => {
    setForm((current) => ({
      ...current,

      name: originalForm.name,

      phone: originalForm.phone,
    }));

    setImagePreview(form.profileImage || "");

    setMessage({
      type: "",

      text: "",
    });
  };

  const handleSave = async (event) => {
    event?.preventDefault();

    if (!form.name.trim()) {
      showMessage("error", "Name is required.");

      return;
    }

    if (form.name.trim().length < 2) {
      showMessage("error", "Name must contain at least 2 characters.");

      return;
    }

    if (form.name.trim().length > 100) {
      showMessage("error", "Name cannot exceed 100 characters.");

      return;
    }

    if (form.phone && form.phone.length > 30) {
      showMessage("error", "Phone number cannot exceed 30 characters.");

      return;
    }

    if (!hasChanges) {
      return;
    }

    if (uploading || removing) {
      showMessage("error", "Please wait for the profile image operation to finish.");

      return;
    }

    try {
      setSaving(true);

      const response = await updateProfile({
        name: form.name.trim(),

        phone: form.phone.trim() || null,
      });

      const responseUser = response?.data?.user || response?.user || response?.data || null;

      const updatedUser = responseUser?.user || responseUser || null;

      const nextForm = {
        name: updatedUser?.name ?? form.name.trim(),

        email: updatedUser?.email ?? form.email,

        phone: updatedUser?.phone ?? "",

        profileImage: updatedUser?.profileImage ?? form.profileImage ?? "",

        profileImagePublicId: updatedUser?.profileImagePublicId ?? form.profileImagePublicId ?? "",
      };

      setUser((current) => ({
        ...(current || {}),

        ...(updatedUser || {}),
      }));

      setForm(nextForm);

      setOriginalForm(nextForm);

      setImagePreview(nextForm.profileImage || "");

      try {
        localStorage.setItem(
          "user",

          JSON.stringify({
            ...(user || {}),

            ...(updatedUser || {}),
          })
        );
      } catch {}

      await showAuthSuccess("Profile Updated", "Your profile has been updated successfully.", {
        timer: 1800,

        showConfirmButton: false,
      });
    } catch (error) {
      await showAuthError("Update Failed", error.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{`.crm-profile-loading{min-height:calc(100vh - 72px);display:grid;place-items:center;background:var(--crm-bg);color:var(--crm-muted)}.crm-profile-loading-box{display:flex;align-items:center;gap:10px;font-size:13px}.crm-profile-spin{animation:crmProfileSpin .9s linear infinite}@keyframes crmProfileSpin{to{transform:rotate(360deg)}}`}</style>

        <div className="crm-profile-loading">
          <div className="crm-profile-loading-box">
            <Loader2 size={18} className="crm-profile-spin" />
            Loading your profile...
          </div>
        </div>
      </>
    );
  }

  const initials = getInitials(form.name);

  const status = user?.status || "UNKNOWN";

  const normalizedStatus = String(status).toUpperCase();

  const isActive = normalizedStatus === "ACTIVE";

  const emailVerified = Boolean(user?.emailVerified);
  const accountRole = isBusinessOwner ? "Business Owner" : user?.accessLevel || "User";
  const businessAddress = [businessDetails?.address?.line1, businessDetails?.address?.line2, businessDetails?.address?.city, businessDetails?.address?.state, businessDetails?.address?.postalCode, businessDetails?.address?.country].filter(Boolean).join(", ");
  const businessDetailsRows = [
    { label: "Business name", value: businessDetails?.name, icon: Building2 },
    { label: "Legal name", value: businessDetails?.legalName, icon: BriefcaseBusiness },
    { label: "Business type", value: businessDetails?.businessType, icon: BriefcaseBusiness },
    { label: "Industry", value: businessDetails?.industry, icon: Building2 },
    { label: "Description", value: businessDetails?.description, icon: Edit3 },
    { label: "Website", value: businessDetails?.website, icon: Globe2 },
    { label: "Business email", value: businessDetails?.email, icon: Mail },
    { label: "Business phone", value: businessDetails?.phone, icon: Phone },
    { label: "Address", value: businessAddress || (typeof businessDetails?.address === "string" ? businessDetails.address : ""), icon: MapPin },
    { label: "Timezone", value: businessDetails?.timezone, icon: Clock3 },
    { label: "Currency", value: businessDetails?.currency, icon: WalletCards },
    { label: "Date format", value: businessDetails?.dateFormat, icon: CalendarDays },
    { label: "Time format", value: businessDetails?.timeFormat, icon: Clock3 },
    { label: "Business status", value: businessDetails?.status, icon: ShieldCheck },
    { label: "Onboarding", value: businessDetails?.onboardingCompleted ? "Completed" : "Not completed", icon: CheckCircle2 },
    { label: "Owner ID", value: businessDetails?.ownerId, icon: User },
  ];
  const accountDetailsRows = [
    { label: "Full name", value: user?.name, icon: User },
    { label: "Email", value: user?.email, icon: Mail },
    { label: "Phone", value: user?.phone, icon: Phone },
    { label: "Business ID", value: businessId || user?.businessId, icon: Building2 },
    { label: "Membership ID", value: user?.membershipId, icon: ShieldCheck },
    { label: "User ID", value: user?._id, icon: User },
    { label: "Role", value: accountRole, icon: ShieldCheck },
    { label: "Access level", value: user?.accessLevel, icon: ShieldCheck },
    { label: "Account status", value: user?.status, icon: ShieldCheck },
    { label: "Email verification", value: user?.emailVerified ? "Verified" : "Not verified", icon: CheckCircle2 },
    { label: "Master admin", value: user?.isMasterAdmin ? "Yes" : "No", icon: ShieldCheck },
    { label: "Member since", value: formatDate(user?.createdAt), icon: CalendarDays },
    { label: "Last login", value: formatDateTime(user?.lastLoginAt), icon: Clock3 },
    { label: "User created", value: formatDateTime(user?.createdAt), icon: CalendarDays },
    { label: "Profile updated", value: formatDateTime(user?.updatedAt), icon: CalendarDays },
  ];

  return (
    <>
      <style>{`.crm-profile-page{min-height:calc(100vh - 72px);background:var(--crm-bg);padding:28px 24px 40px;color:var(--crm-text)}.crm-profile-container{width:100%;max-width:1240px;margin:0 auto}.crm-profile-top{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:24px}.crm-profile-heading h1{margin:0;font-size:25px;line-height:1.2;font-weight:400;letter-spacing:-.4px;color:var(--crm-text)}.crm-profile-heading p{margin:7px 0 0;font-size:13px;line-height:1.6;color:var(--crm-muted)}.crm-profile-back{height:38px;display:inline-flex;align-items:center;gap:8px;padding:0 13px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);font-size:13px;font-weight:400;cursor:pointer;transition:.2s ease}.crm-profile-back:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-1px)}.crm-profile-layout{display:grid;grid-template-columns:330px minmax(0,1fr);gap:20px;align-items:start}.crm-profile-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;box-shadow:0 8px 30px rgba(15,23,42,.05);overflow:hidden}.crm-profile-identity{padding:28px 22px 24px;text-align:center;position:relative}.crm-profile-avatar-wrap{position:relative;width:116px;height:116px;margin:0 auto 18px;display:flex;align-items:center;justify-content:center}.crm-profile-avatar-wrap:before{content:"";position:absolute;inset:-13px;border-radius:24px;background:conic-gradient(from 0deg,rgba(99,102,241,.08),rgba(56,189,248,.35),rgba(139,92,246,.26),rgba(59,130,246,.08));filter:blur(13px);animation:crmProfileGlow 5s linear infinite;z-index:0}.crm-profile-avatar-wrap:after{content:"";position:absolute;inset:-5px;border-radius:20px;border:1px solid rgba(99,102,241,.18);box-shadow:0 0 25px rgba(99,102,241,.14),0 0 45px rgba(56,189,248,.09);animation:crmProfilePulse 3s ease-in-out infinite;z-index:0}.crm-profile-avatar{position:relative;z-index:1;width:108px;height:108px;border-radius:18px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:linear-gradient(135deg,var(--crm-primary),#38bdf8);color:#fff;font-size:27px;font-weight:400;box-shadow:0 8px 28px rgba(79,70,229,.2);border:3px solid var(--crm-surface)}.crm-profile-avatar img{width:100%;height:100%;display:block;object-fit:cover}.crm-profile-camera{position:absolute;right:-3px;bottom:-3px;z-index:3;width:32px;height:32px;border:3px solid var(--crm-surface);border-radius:10px;background:var(--crm-primary);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 5px 14px rgba(79,70,229,.25);transition:.2s ease}.crm-profile-camera:hover:not(:disabled){transform:translateY(-2px) scale(1.03)}.crm-profile-camera:disabled{opacity:.7;cursor:not-allowed}.crm-profile-name{margin:0;font-size:18px;font-weight:400;color:var(--crm-text);line-height:1.35}.crm-profile-email{margin:5px 0 0;font-size:13px;color:var(--crm-muted);word-break:break-word}.crm-profile-badges{display:flex;justify-content:center;align-items:center;gap:7px;flex-wrap:wrap;margin-top:13px}.crm-profile-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border:1px solid var(--crm-border);border-radius:7px;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;font-weight:400;letter-spacing:.2px}.crm-profile-badge.active{color:var(--crm-success);border-color:rgba(34,197,94,.2)}.crm-profile-badge.verified{color:var(--crm-primary);border-color:rgba(99,102,241,.2)}.crm-profile-image-actions{display:flex;justify-content:center;gap:7px;margin-top:17px}.crm-profile-small-btn{height:32px;display:inline-flex;align-items:center;gap:6px;padding:0 10px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface-2);color:var(--crm-text);font-size:13px;font-weight:400;cursor:pointer;transition:.2s ease}.crm-profile-small-btn:hover:not(:disabled){border-color:var(--crm-primary);color:var(--crm-primary)}.crm-profile-small-btn.danger{color:#ef4444}.crm-profile-small-btn.danger:hover:not(:disabled){border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.05)}.crm-profile-small-btn:disabled{opacity:.55;cursor:not-allowed}.crm-profile-upload{margin-top:15px}.crm-profile-upload-track{height:5px;border-radius:20px;background:var(--crm-surface-2);overflow:hidden}.crm-profile-upload-bar{height:100%;border-radius:20px;background:linear-gradient(90deg,var(--crm-primary),#38bdf8);transition:width .2s ease}.crm-profile-upload-text{margin-top:7px;font-size:13px;color:var(--crm-muted)}.crm-profile-meta{border-top:1px solid var(--crm-border);padding:20px 22px}.crm-profile-meta-title{margin:0 0 15px;font-size:13px;font-weight:400;color:var(--crm-text);text-transform:uppercase;letter-spacing:.5px}.crm-profile-meta-list{display:flex;flex-direction:column;gap:14px}.crm-profile-meta-item{display:flex;align-items:center;gap:10px}.crm-profile-meta-icon{width:30px;height:30px;flex:0 0 30px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface-2);color:var(--crm-primary);display:flex;align-items:center;justify-content:center}.crm-profile-meta-copy{min-width:0;display:flex;flex-direction:column;gap:2px}.crm-profile-meta-label{font-size:13px;color:var(--crm-muted)}.crm-profile-meta-value{font-size:13px;color:var(--crm-text);font-weight:400;word-break:break-word}.crm-profile-business-card{margin:0 24px 24px;border:1px solid var(--crm-border);border-radius:12px;background:var(--crm-surface);overflow:hidden}.crm-profile-business-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:15px 16px;border-bottom:1px solid var(--crm-border);cursor:pointer}.crm-profile-business-title{display:flex;align-items:center;gap:10px;min-width:0}.crm-profile-business-title-icon{width:34px;height:34px;flex:0 0 34px;border-radius:9px;background:rgba(99,102,241,.09);color:var(--crm-primary);display:flex;align-items:center;justify-content:center}.crm-profile-business-title-copy{min-width:0}.crm-profile-business-title-copy h3{margin:0;font-size:14px;font-weight:400;color:var(--crm-text)}.crm-profile-business-title-copy p{margin:3px 0 0;font-size:12px;color:var(--crm-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.crm-profile-business-toggle{width:31px;height:31px;display:flex;align-items:center;justify-content:center;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface-2);color:var(--crm-muted);flex:0 0 31px}.crm-profile-business-body{padding:18px 16px 16px}.crm-profile-detail-section-title{margin:0 0 12px;font-size:12px;font-weight:400;text-transform:uppercase;letter-spacing:.5px;color:var(--crm-muted)}.crm-profile-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.crm-profile-detail-item{min-width:0;padding:11px 12px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface-2)}.crm-profile-detail-item.full{grid-column:1/-1}.crm-profile-detail-top{display:flex;align-items:center;gap:7px;margin-bottom:5px}.crm-profile-detail-icon{color:var(--crm-primary);display:flex;align-items:center;justify-content:center}.crm-profile-detail-label{font-size:11px;color:var(--crm-muted)}.crm-profile-detail-row{display:flex;align-items:flex-start;gap:8px;min-width:0}.crm-profile-detail-value{min-width:0;flex:1;font-size:13px;line-height:1.5;color:var(--crm-text);word-break:break-word}.crm-profile-copy-btn{width:26px;height:26px;flex:0 0 26px;display:flex;align-items:center;justify-content:center;border:1px solid var(--crm-border);border-radius:7px;background:var(--crm-surface);color:var(--crm-muted);cursor:pointer;transition:.2s ease}.crm-profile-copy-btn:hover{border-color:var(--crm-primary);color:var(--crm-primary);background:var(--crm-primary-soft)}.crm-profile-detail-divider{height:1px;background:var(--crm-border);margin:18px 0}.crm-profile-business-link{color:var(--crm-primary);text-decoration:none}.crm-profile-business-link:hover{text-decoration:underline}.crm-profile-form-card{min-width:0}.crm-profile-section-head{padding:21px 24px;border-bottom:1px solid var(--crm-border)}.crm-profile-section-title{display:flex;align-items:center;gap:11px}.crm-profile-section-icon{width:35px;height:35px;border-radius:9px;background:rgba(99,102,241,.09);color:var(--crm-primary);display:flex;align-items:center;justify-content:center}.crm-profile-section-title h2{margin:0;font-size:15px;font-weight:400;color:var(--crm-text)}.crm-profile-section-title p{margin:3px 0 0;font-size:13px;color:var(--crm-muted)}.crm-profile-form{padding:24px}.crm-profile-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.crm-profile-field{min-width:0}.crm-profile-field.full{grid-column:1/-1}.crm-profile-label{display:flex;align-items:center;gap:4px;margin-bottom:7px;font-size:13px;font-weight:400;color:var(--crm-text)}.crm-profile-label-required{color:#ef4444}.crm-profile-input-wrap{position:relative}.crm-profile-input-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--crm-muted);pointer-events:none}.crm-profile-input{width:100%;height:40px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);font-size:13px;outline:none;transition:.2s ease;box-sizing:border-box}.crm-profile-input.with-icon{padding:0 12px 0 35px}.crm-profile-input::placeholder{color:var(--crm-muted);opacity:.75}.crm-profile-input:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px rgba(99,102,241,.08)}.crm-profile-readonly .crm-profile-input{padding-right:85px;background:var(--crm-surface-2);cursor:not-allowed}.crm-profile-readonly-tag{position:absolute;right:9px;top:50%;transform:translateY(-50%);font-size:13px;font-weight:400;padding:4px 6px;border-radius:5px;background:var(--crm-surface);border:1px solid var(--crm-border);color:var(--crm-muted)}.crm-profile-info-box{display:flex;gap:10px;margin:0 24px 24px;padding:12px 13px;border:1px solid rgba(99,102,241,.14);border-radius:9px;background:rgba(99,102,241,.045);color:var(--crm-primary)}.crm-profile-info-box p{margin:0;font-size:13px;line-height:1.65;color:var(--crm-muted)}.crm-profile-info-box strong{color:var(--crm-text)}.crm-profile-footer{display:flex;justify-content:flex-end;gap:9px;padding:17px 24px;border-top:1px solid var(--crm-border);background:var(--crm-surface-2)}.crm-profile-btn{height:37px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 13px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);font-size:13px;font-weight:400;cursor:pointer;transition:.2s ease}.crm-profile-btn:hover:not(:disabled){border-color:var(--crm-primary);color:var(--crm-primary)}.crm-profile-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff;box-shadow:0 5px 15px rgba(79,70,229,.17)}.crm-profile-btn.primary:hover:not(:disabled){filter:brightness(1.05);color:#fff;transform:translateY(-1px)}.crm-profile-btn:disabled{opacity:.48;cursor:not-allowed;transform:none!important}.crm-profile-alert{position:fixed;right:24px;bottom:24px;z-index:9999;min-width:310px;max-width:430px;display:flex;align-items:flex-start;gap:10px;padding:13px 13px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface);box-shadow:0 15px 45px rgba(15,23,42,.14);animation:crmProfileAlertIn .25s ease}.crm-profile-alert.success{border-color:rgba(34,197,94,.22)}.crm-profile-alert.error{border-color:rgba(239,68,68,.22)}.crm-profile-alert-icon{width:27px;height:27px;flex:0 0 27px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:rgba(34,197,94,.1);color:var(--crm-success)}.crm-profile-alert.error .crm-profile-alert-icon{background:rgba(239,68,68,.1);color:#ef4444}.crm-profile-alert-copy{min-width:0;flex:1}.crm-profile-alert-title{margin:0 0 2px;font-size:13px;font-weight:400;color:var(--crm-text)}.crm-profile-alert-text{margin:0;font-size:13px;line-height:1.5;color:var(--crm-muted)}.crm-profile-alert-close{border:0;background:transparent;color:var(--crm-muted);padding:3px;cursor:pointer}.crm-profile-alert-close:hover{color:var(--crm-text)}@keyframes crmProfileGlow{0%{transform:rotate(0deg) scale(.98);opacity:.7}50%{transform:rotate(180deg) scale(1.04);opacity:1}100%{transform:rotate(360deg) scale(.98);opacity:.7}}@keyframes crmProfilePulse{0%,100%{opacity:.45;transform:scale(.98)}50%{opacity:.9;transform:scale(1.02)}}@keyframes crmProfileAlertIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.crm-profile-edit-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:14px}.crm-profile-edit-head p,.crm-profile-edit-address-head p{margin:3px 0 0;font-size:11px;line-height:1.5;color:var(--crm-muted)}.crm-profile-business-readonly-note{font-size:12px;color:var(--crm-muted);padding:8px 10px;border:1px solid var(--crm-border);border-radius:8px}.crm-profile-business-actions{display:flex;gap:7px;flex:0 0 auto}.crm-profile-small-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.crm-profile-small-btn.primary:hover:not(:disabled){background:var(--crm-primary);color:#fff;filter:brightness(1.05)}.crm-profile-edit-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.crm-profile-edit-field{min-width:0}.crm-profile-edit-field.full{grid-column:1/-1}.crm-profile-edit-field label{display:block;margin:0 0 5px;font-size:11px;color:var(--crm-muted)}.crm-profile-edit-field input,.crm-profile-edit-field textarea{width:100%;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);font:inherit;font-size:12px;outline:none;padding:9px 10px;transition:.2s ease;box-sizing:border-box}.crm-profile-edit-field input{height:37px}.crm-profile-edit-field textarea{min-height:74px;resize:vertical;line-height:1.5}.crm-profile-edit-field input::placeholder,.crm-profile-edit-field textarea::placeholder{color:var(--crm-muted);opacity:.7}.crm-profile-edit-field input:focus,.crm-profile-edit-field textarea:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px rgba(99,102,241,.08)}.crm-profile-edit-address-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.crm-profile-edit-address-head>svg{color:var(--crm-primary)}@media(max-width:900px){.crm-profile-layout{grid-template-columns:1fr}.crm-profile-identity{padding-top:25px}.crm-profile-top{align-items:flex-start}}@media(max-width:640px){.crm-profile-page{padding:20px 14px 30px}.crm-profile-top{flex-direction:column}.crm-profile-back{width:100%;justify-content:center}.crm-profile-form-grid{grid-template-columns:1fr}.crm-profile-field.full{grid-column:auto}.crm-profile-form{padding:18px}.crm-profile-info-box{margin:0 18px 18px}.crm-profile-footer{padding:14px 18px;flex-direction:column-reverse}.crm-profile-btn{width:100%}.crm-profile-alert{left:14px;right:14px;bottom:14px;min-width:0}.crm-profile-section-head{padding:18px}.crm-profile-meta{padding:18px 20px}.crm-profile-business-card{margin:0 18px 18px}.crm-profile-detail-grid{grid-template-columns:1fr}.crm-profile-edit-grid{grid-template-columns:1fr}.crm-profile-edit-field.full{grid-column:auto}.crm-profile-detail-item.full{grid-column:auto}.crm-profile-edit-head{flex-direction:column}.crm-profile-business-actions{width:100%}.crm-profile-business-actions .crm-profile-small-btn{flex:1}.crm-profile-business-head{padding:14px}.crm-profile-business-body{padding:16px 14px 14px}}`}</style>

      <div className="crm-profile-page">
        <div className="crm-profile-container">
          <div className="crm-profile-top">
            <div className="crm-profile-heading">
              <h1>My Profile</h1>

              <p>Manage your personal information and profile settings.</p>
            </div>

            <button type="button" className="crm-profile-back" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={15} />
              Back to Dashboard
            </button>
          </div>

          <div className="crm-profile-layout">
            <aside className="crm-profile-card">
              <div className="crm-profile-identity">
                <div className="crm-profile-avatar-wrap">
                  <div className="crm-profile-avatar">{imagePreview ? <img src={imagePreview} alt={`${form.name || "User"} profile`} /> : initials}</div>

                  <button type="button" className="crm-profile-camera" title="Change profile picture" aria-label="Change profile picture" disabled={uploading || removing} onClick={() => fileInputRef.current?.click()}>
                    {uploading ? <Loader2 size={16} className="crm-profile-spin" /> : <Camera size={16} />}
                  </button>

                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/jpg" onChange={handleImageSelect} hidden />
                </div>

                <h2 className="crm-profile-name">{form.name || "Your Name"}</h2>

                <p className="crm-profile-email">{form.email || "No email available"}</p>

                <div className="crm-profile-badges">
                  <span className={`crm-profile-badge ${isActive ? "active" : ""}`}>
                    <span
                      style={{
                        width: 5,

                        height: 5,

                        borderRadius: "50%",

                        background: isActive ? "var(--crm-success)" : "var(--crm-muted)",
                      }}
                    />

                    {status}
                  </span>

                  {emailVerified && (
                    <span className="crm-profile-badge verified">
                      <CheckCircle2 size={12} />
                      Email verified
                    </span>
                  )}
                </div>

                <div className="crm-profile-image-actions">
                  <button type="button" className="crm-profile-small-btn" disabled={uploading || removing} onClick={() => fileInputRef.current?.click()}>
                    {uploading ? <Loader2 size={13} className="crm-profile-spin" /> : <ImageIcon size={13} />}

                    {uploading ? "Uploading..." : "Change photo"}
                  </button>

                  {imagePreview && (
                    <button type="button" className="crm-profile-small-btn danger" disabled={uploading || removing} onClick={handleRemoveImage}>
                      {removing ? <Loader2 size={13} className="crm-profile-spin" /> : <X size={13} />}

                      {removing ? "Removing..." : "Remove"}
                    </button>
                  )}
                </div>

                {uploading && (
                  <div className="crm-profile-upload">
                    <div className="crm-profile-upload-track">
                      <div
                        className="crm-profile-upload-bar"
                        style={{
                          width: `${uploadProgress}%`,
                        }}
                      />
                    </div>

                    <div className="crm-profile-upload-text">Uploading profile photo... {uploadProgress}%</div>
                  </div>
                )}
              </div>

              <div className="crm-profile-meta">
                <h3 className="crm-profile-meta-title">Business workspace</h3>

                <div className="crm-profile-meta-list">
                  <div className="crm-profile-meta-item">
                    <div className="crm-profile-meta-icon">
                      <Building2 size={14} />
                    </div>

                    <div className="crm-profile-meta-copy">
                      <span className="crm-profile-meta-label">Business name</span>

                      <span className="crm-profile-meta-value">{businessDetails?.name || businessDetails?.legalName || business?.name || business?.legalName || "Business workspace"}</span>
                    </div>
                  </div>

                  <div className="crm-profile-meta-item">
                    <div className="crm-profile-meta-icon">
                      <Mail size={14} />
                    </div>

                    <div className="crm-profile-meta-copy">
                      <span className="crm-profile-meta-label">Business email</span>

                      <span className="crm-profile-meta-value">{businessDetails?.email || "—"}</span>
                    </div>
                  </div>

                  <div className="crm-profile-meta-item">
                    <div className="crm-profile-meta-icon">
                      <Phone size={14} />
                    </div>

                    <div className="crm-profile-meta-copy">
                      <span className="crm-profile-meta-label">Business phone</span>

                      <span className="crm-profile-meta-value">{businessDetails?.phone || businessDetails?.alternatePhone || "—"}</span>
                    </div>
                  </div>

                  <div className="crm-profile-meta-item">
                    <div className="crm-profile-meta-icon">
                      <ShieldCheck size={14} />
                    </div>

                    <div className="crm-profile-meta-copy">
                      <span className="crm-profile-meta-label">Business status</span>

                      <span className="crm-profile-meta-value">{businessDetails?.status || "ACTIVE"}</span>
                    </div>
                  </div>

                  <div className="crm-profile-meta-item">
                    <div className="crm-profile-meta-icon">
                      <Building2 size={14} />
                    </div>

                    <div className="crm-profile-meta-copy">
                      <span className="crm-profile-meta-label">Industry</span>

                      <span className="crm-profile-meta-value">{businessDetails?.industry || "—"}</span>
                    </div>
                  </div>

                  <div className="crm-profile-meta-item">
                    <div className="crm-profile-meta-icon">
                      <Building2 size={14} />
                    </div>

                    <div className="crm-profile-meta-copy">
                      <span className="crm-profile-meta-label">Website</span>

                      <span className="crm-profile-meta-value">{businessDetails?.website || "—"}</span>
                    </div>
                  </div>

                  <div className="crm-profile-meta-item">
                    <div className="crm-profile-meta-icon">
                      <Building2 size={14} />
                    </div>

                    <div className="crm-profile-meta-copy">
                      <span className="crm-profile-meta-label">Address</span>

                      <span className="crm-profile-meta-value">
                        {[businessDetails?.address?.line1, businessDetails?.address?.city, businessDetails?.address?.state, businessDetails?.address?.country].filter(Boolean).join(", ") || (typeof businessDetails?.address === "string" ? businessDetails.address : "—")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="crm-profile-meta">
                <h3 className="crm-profile-meta-title">Account overview</h3>

                <div className="crm-profile-meta-list">
                  <div className="crm-profile-meta-item">
                    <div className="crm-profile-meta-icon">
                      <User size={14} />
                    </div>

                    <div className="crm-profile-meta-copy">
                      <span className="crm-profile-meta-label">Member since</span>

                      <span className="crm-profile-meta-value">{formatDate(user?.createdAt)}</span>
                    </div>
                  </div>

                  <div className="crm-profile-meta-item">
                    <div className="crm-profile-meta-icon">
                      <Clock3 size={14} />
                    </div>

                    <div className="crm-profile-meta-copy">
                      <span className="crm-profile-meta-label">Last login</span>

                      <span className="crm-profile-meta-value">{formatDateTime(user?.lastLoginAt)}</span>
                    </div>
                  </div>

                  <div className="crm-profile-meta-item">
                    <div className="crm-profile-meta-icon">
                      <ShieldCheck size={14} />
                    </div>

                    <div className="crm-profile-meta-copy">
                      <span className="crm-profile-meta-label">Account status</span>

                      <span className="crm-profile-meta-value">{status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <section className="crm-profile-card crm-profile-form-card">
              <div className="crm-profile-section-head">
                <div className="crm-profile-section-title">
                  <div className="crm-profile-section-icon">
                    <Edit3 size={17} />
                  </div>

                  <div>
                    <h2>Personal information</h2>

                    <p>Keep your account information up to date.</p>
                  </div>
                </div>
              </div>

              <form className="crm-profile-form" onSubmit={handleSave}>
                <div className="crm-profile-form-grid">
                  <div className="crm-profile-field">
                    <label htmlFor="profile-name" className="crm-profile-label">
                      Full name
                      <span className="crm-profile-label-required">*</span>
                    </label>

                    <div className="crm-profile-input-wrap">
                      <User size={15} className="crm-profile-input-icon" />

                      <input id="profile-name" name="name" type="text" value={form.name} onChange={handleChange} className="crm-profile-input with-icon" placeholder="Enter your full name" maxLength={100} autoComplete="name" />
                    </div>
                  </div>

                  <div className="crm-profile-field">
                    <label htmlFor="profile-phone" className="crm-profile-label">
                      Phone number
                    </label>

                    <div className="crm-profile-input-wrap">
                      <Phone size={15} className="crm-profile-input-icon" />

                      <input id="profile-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="crm-profile-input with-icon" placeholder="Enter phone number" maxLength={30} autoComplete="tel" />
                    </div>
                  </div>

                  <div className="crm-profile-field full">
                    <label htmlFor="profile-email" className="crm-profile-label">
                      Email address
                    </label>

                    <div className="crm-profile-input-wrap crm-profile-readonly">
                      <Mail size={15} className="crm-profile-input-icon" />

                      <input id="profile-email" name="email" type="email" value={form.email} className="crm-profile-input with-icon" disabled readOnly />

                      <span className="crm-profile-readonly-tag">Read only</span>
                    </div>
                  </div>
                </div>

                <div className="crm-profile-info-box">
                  <ShieldCheck size={16} />

                  <p>
                    <strong>Your account is protected.</strong> Your email address is linked to your account and cannot be changed from this page. Contact your administrator if you need to update it.
                  </p>
                </div>
              </form>

              <div className="crm-profile-footer">
                <button type="button" className="crm-profile-btn" disabled={!hasChanges || saving || uploading || removing} onClick={handleCancel}>
                  <X size={14} />
                  Discard changes
                </button>

                <button type="button" className="crm-profile-btn primary" disabled={!hasChanges || saving || uploading || removing} onClick={handleSave}>
                  {saving ? (
                    <>
                      <Loader2 size={14} className="crm-profile-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save changes
                    </>
                  )}
                </button>
              </div>

              <div className="crm-profile-business-card">
                <div
                  className="crm-profile-business-head"
                  role="button"
                  tabIndex={0}
                  onClick={() => setBusinessExpanded((value) => !value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setBusinessExpanded((value) => !value);
                    }
                  }}>
                  <div className="crm-profile-business-title">
                    <div className="crm-profile-business-title-icon">
                      <Building2 size={16} />
                    </div>
                    <div className="crm-profile-business-title-copy">
                      <h3>Business & Account details</h3>
                      <p>
                        {businessDetails?.name || "Your business workspace"} · {accountRole}
                      </p>
                    </div>
                  </div>
                  <div className="crm-profile-business-toggle" aria-label={businessExpanded ? "Collapse details" : "Expand details"}>
                    {businessExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </div>
                </div>
                {businessExpanded && (
                  <div className="crm-profile-business-body">
                    <div className="crm-profile-edit-head">
                      <div>
                        <h4 className="crm-profile-detail-section-title">Business information</h4>
                        <p>Edit your business details below. Changes are saved to your business account.</p>
                      </div>
                      {isBusinessOwner ? (
                        <div className="crm-profile-business-actions">
                          <button type="button" className="crm-profile-small-btn" onClick={handleBusinessCancel} disabled={businessSaving}>
                            Cancel
                          </button>
                          <button type="button" className="crm-profile-small-btn primary" onClick={handleBusinessSave} disabled={businessSaving}>
                            {businessSaving ? (
                              <>
                                <Loader2 size={13} className="crm-profile-spin" /> Saving...
                              </>
                            ) : (
                              <>
                                <Save size={13} /> Save
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="crm-profile-business-readonly-note">Only the Business Owner can edit business details.</div>
                      )}
                    </div>
                    <div className="crm-profile-edit-grid">
                      <div className="crm-profile-edit-field">
                        <label>Business name</label>
                        <input readOnly={!isBusinessOwner} value={businessForm.name} name="name" onChange={handleBusinessChange} placeholder="Business name" />
                      </div>
                      <div className="crm-profile-edit-field">
                        <label>Legal name</label>
                        <input readOnly={!isBusinessOwner} value={businessForm.legalName} name="legalName" onChange={handleBusinessChange} placeholder="e.g. BR30 CRM Technologies Pvt. Ltd." />
                      </div>
                      <div className="crm-profile-edit-field">
                        <label>Business type</label>
                        <input readOnly={!isBusinessOwner} value={businessForm.businessType} name="businessType" onChange={handleBusinessChange} placeholder="e.g. SaaS, Retail, Agency" />
                      </div>
                      <div className="crm-profile-edit-field">
                        <label>Industry</label>
                        <input readOnly={!isBusinessOwner} value={businessForm.industry} name="industry" onChange={handleBusinessChange} placeholder="e.g. Technology" />
                      </div>
                      <div className="crm-profile-edit-field full">
                        <label>Description</label>
                        <textarea readOnly={!isBusinessOwner} value={businessForm.description} name="description" onChange={handleBusinessChange} rows={3} placeholder="Tell us about your business" />
                      </div>
                      <div className="crm-profile-edit-field full">
                        <label>Website</label>
                        <input readOnly={!isBusinessOwner} value={businessForm.website} name="website" onChange={handleBusinessChange} placeholder="https://example.com" />
                      </div>
                    </div>
                    <div className="crm-profile-detail-divider" />
                    <div className="crm-profile-edit-address-head">
                      <div>
                        <h4 className="crm-profile-detail-section-title">Business address</h4>
                        <p>Add or update the business address.</p>
                      </div>
                      <MapPin size={15} />
                    </div>
                    <div className="crm-profile-edit-grid">
                      <div className="crm-profile-edit-field full">
                        <label>Address line 1</label>
                        <input readOnly={!isBusinessOwner} value={businessForm.address.line1} name="line1" onChange={handleBusinessAddressChange} placeholder="Street / building / area" />
                      </div>
                      <div className="crm-profile-edit-field full">
                        <label>Address line 2</label>
                        <input readOnly={!isBusinessOwner} value={businessForm.address.line2} name="line2" onChange={handleBusinessAddressChange} placeholder="Apartment / landmark (optional)" />
                      </div>
                      <div className="crm-profile-edit-field">
                        <label>City</label>
                        <input readOnly={!isBusinessOwner} value={businessForm.address.city} name="city" onChange={handleBusinessAddressChange} placeholder="City" />
                      </div>
                      <div className="crm-profile-edit-field">
                        <label>State</label>
                        <input readOnly={!isBusinessOwner} value={businessForm.address.state} name="state" onChange={handleBusinessAddressChange} placeholder="State" />
                      </div>
                      <div className="crm-profile-edit-field">
                        <label>Postal code</label>
                        <input readOnly={!isBusinessOwner} value={businessForm.address.postalCode} name="postalCode" onChange={handleBusinessAddressChange} placeholder="Postal code" />
                      </div>
                      <div className="crm-profile-edit-field">
                        <label>Country</label>
                        <input readOnly={!isBusinessOwner} value={businessForm.address.country} name="country" onChange={handleBusinessAddressChange} placeholder="Country" />
                      </div>
                    </div>
                    <div className="crm-profile-detail-divider" />
                    <h4 className="crm-profile-detail-section-title">Business & account information</h4>
                    <div className="crm-profile-detail-grid">
                      {businessDetailsRows.map(({ label, value, icon: Icon }) => {
                        const displayValue = value || "Not provided";
                        return (
                          <div className={`crm-profile-detail-item ${label === "Description" || label === "Address" ? "full" : ""}`} key={label}>
                            <div className="crm-profile-detail-top">
                              <span className="crm-profile-detail-icon">
                                <Icon size={13} />
                              </span>
                              <span className="crm-profile-detail-label">{label}</span>
                            </div>
                            <div className="crm-profile-detail-row">
                              <span className="crm-profile-detail-value">
                                {label === "Website" && value ? (
                                  <a className="crm-profile-business-link" href={String(value).startsWith("http") ? value : `https://${value}`} target="_blank" rel="noreferrer">
                                    {value}
                                  </a>
                                ) : (
                                  displayValue
                                )}
                              </span>
                              <button type="button" className="crm-profile-copy-btn" title={`Copy ${label}`} aria-label={`Copy ${label}`} onClick={() => copyValue(value, label)}>
                                <Copy size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="crm-profile-detail-divider" />
                    <h4 className="crm-profile-detail-section-title">User & account information</h4>
                    <div className="crm-profile-detail-grid">
                      {accountDetailsRows.map(({ label, value, icon: Icon }) => (
                        <div className="crm-profile-detail-item" key={label}>
                          <div className="crm-profile-detail-top">
                            <span className="crm-profile-detail-icon">
                              <Icon size={13} />
                            </span>
                            <span className="crm-profile-detail-label">{label}</span>
                          </div>
                          <div className="crm-profile-detail-row">
                            <span className="crm-profile-detail-value">{value || "Not provided"}</span>
                            <button type="button" className="crm-profile-copy-btn" title={`Copy ${label}`} aria-label={`Copy ${label}`} onClick={() => copyValue(value, label)}>
                              <Copy size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`crm-profile-alert ${message.type}`} role="alert">
          <div className="crm-profile-alert-icon">{message.type === "success" ? <Check size={15} /> : <X size={15} />}</div>

          <div className="crm-profile-alert-copy">
            <p className="crm-profile-alert-title">{message.type === "success" ? "Success" : "Something went wrong"}</p>

            <p className="crm-profile-alert-text">{message.text}</p>
          </div>

          <button
            type="button"
            className="crm-profile-alert-close"
            onClick={() =>
              setMessage({
                type: "",

                text: "",
              })
            }
            aria-label="Close message">
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}

export default MyProfile;
