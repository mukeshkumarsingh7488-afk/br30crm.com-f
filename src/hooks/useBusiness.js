import { useCallback, useEffect, useState } from "react";

import { getMyBusinessMemberships } from "../api/crm.api";
import { clearAccess, saveAccess } from "../utils/permissions";

const BUSINESS_STORAGE_KEY = "br30-business-id";

const getRolePermissions = (role) => {
  if (!Array.isArray(role?.permissions)) return [];

  return role.permissions
    .map((permission) => (typeof permission === "string" ? permission : permission?.slug || ""))
    .filter(Boolean);
};

export default function useBusiness() {
  const [businessId, setBusinessId] = useState(localStorage.getItem(BUSINESS_STORAGE_KEY) || "");
  const [business, setBusiness] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshBusiness = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMyBusinessMemberships({
        status: "ACTIVE",
        page: 1,
        limit: 100,
      });

      const data = response?.data || response || {};
      const memberships = data?.memberships || data?.items || [];

      if (!Array.isArray(memberships) || memberships.length === 0) {
        localStorage.removeItem(BUSINESS_STORAGE_KEY);
        clearAccess();
        setBusinessId("");
        setBusiness(null);
        setRole(null);
        setPermissions([]);
        setIsBusinessOwner(false);
        throw new Error("No active BR30 CRM business membership found.");
      }

      const active = memberships.find((item) => item?.businessId?._id || item?.businessId || item?.business?._id);

      if (!active) {
        localStorage.removeItem(BUSINESS_STORAGE_KEY);
        clearAccess();
        setBusinessId("");
        setBusiness(null);
        setRole(null);
        setPermissions([]);
        setIsBusinessOwner(false);
        throw new Error("No active BR30 CRM business membership found.");
      }

      const id = active?.businessId?._id || active?.businessId || active?.business?._id || "";

      if (!id) {
        localStorage.removeItem(BUSINESS_STORAGE_KEY);
        clearAccess();
        setBusinessId("");
        setBusiness(null);
        setRole(null);
        setPermissions([]);
        setIsBusinessOwner(false);
        throw new Error("No valid business ID found in active membership.");
      }

      const normalizedBusinessId = id.toString();
      const nextRole = active?.roleId || null;
      const nextPermissions = getRolePermissions(nextRole);
      const nextBusiness = active?.business || (typeof active?.businessId === "object" ? active.businessId : null);
      const ownerId = nextBusiness?.ownerId || active?.businessId?.ownerId || "";
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const storedUserId = storedUser?.user?._id || storedUser?._id || "";
      const nextIsOwner = String(ownerId || "") === String(storedUserId);

      localStorage.setItem(BUSINESS_STORAGE_KEY, normalizedBusinessId);
      setBusinessId(normalizedBusinessId);
      setBusiness(nextBusiness);
      setRole(nextRole);
      setPermissions(nextPermissions);
      setIsBusinessOwner(nextIsOwner);

      saveAccess({
        businessId: normalizedBusinessId,
        business: nextBusiness,
        role: nextRole,
        permissions: nextPermissions,
        isBusinessOwner: nextIsOwner,
      });

      return normalizedBusinessId;
    } catch (err) {
      setError(err?.message || "Unable to load your business workspace.");
      return "";
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBusiness();
  }, [refreshBusiness]);

  return {
    businessId,
    business,
    role,
    permissions,
    isBusinessOwner,
    loading,
    error,
    refreshBusiness,
  };
}
