import React, { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Eye, Pencil, Plus, RefreshCw, Search, Trash2, UserRound, UsersRound, X, Ban } from "lucide-react";

import useBusiness from "../../hooks/useBusiness";
import { showAuthAlert } from "../../components/auth/authAlert";
import { isManagementRole } from "../../utils/permissions";

import { getTeams, getTeam, createTeam, updateTeam, deleteTeam, addTeamMember, removeTeamMember, getBusinessMembers } from "../../api/operations.api";

export default function Team() {
  const { businessId, loading: businessLoading, error: businessError, role, isBusinessOwner } = useBusiness();
  const canManage = isManagementRole({ role, isBusinessOwner });

  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const [teamForm, setTeamForm] = useState({
    name: "",
    description: "",
    managerId: "",
    memberIds: [],
    status: "ACTIVE",
  });

  const [memberSearch, setMemberSearch] = useState("");
  const [managerSearch, setManagerSearch] = useState("");

  const [managerOpen, setManagerOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);

  const normalizeMembers = (response) => {
    const data = response?.data || response || {};

    return data.members || data.items || data.users || data.results || [];
  };

  const normalizeTeams = (response) => {
    const data = response?.data || response || {};

    return data.teams || data.items || data.results || [];
  };

  const getMemberUser = (member) => {
    return member?.userId || member?.user || member;
  };

  const getMemberId = (member) => {
    const user = getMemberUser(member);

    return user?._id || user?.id || member?.userId?._id || member?.userId || member?._id || member?.id;
  };

  const getMemberName = (member) => {
    const user = getMemberUser(member);

    return user?.name || user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email || "Unknown User";
  };

  const getMemberEmail = (member) => {
    const user = getMemberUser(member);

    return user?.email || "";
  };

  const getMemberPhone = (member) => {
    const user = getMemberUser(member);

    return user?.phone || user?.mobile || "";
  };

  const getMemberImage = (member) => {
    const user = getMemberUser(member);

    return user?.profileImage || user?.avatar || user?.image || "";
  };

  const getTeamMembers = (team) => {
    return team?.members || team?.teamMembers || team?.users || [];
  };

  const getTeamMemberCount = (team) => {
    if (Array.isArray(team?.members)) {
      return team.members.length;
    }

    if (Array.isArray(team?.teamMembers)) {
      return team.teamMembers.length;
    }

    if (Array.isArray(team?.users)) {
      return team.users.length;
    }

    return team?.memberCount ?? team?.membersCount ?? team?.totalMembers ?? 0;
  };

  const getManager = (team) => {
    return team?.managerId || team?.manager || team?.managerUser || null;
  };

  const getManagerName = (team) => {
    const manager = getManager(team);

    if (!manager) {
      return "Unassigned";
    }

    if (typeof manager === "string") {
      const found = members.find((item) => String(getMemberId(item)) === String(manager));

      return found ? getMemberName(found) : "Unassigned";
    }

    return manager?.name || manager?.fullName || `${manager?.firstName || ""} ${manager?.lastName || ""}`.trim() || manager?.email || "Unassigned";
  };

  const getManagerId = (team) => {
    const manager = getManager(team);

    if (!manager) {
      return "";
    }

    if (typeof manager === "string") {
      return manager;
    }

    return manager?._id || manager?.id || "";
  };

  const getStatus = (team) => {
    return String(team?.status || "ACTIVE").toUpperCase();
  };

  const loadTeams = async () => {
    if (!businessId) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getTeams(businessId, {
        page: 1,
        limit: 100,
        includeInactive: true,
      });

      setTeams(normalizeTeams(response));
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || "Unable to load teams.");
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    if (!businessId) {
      return;
    }

    setMembersLoading(true);

    try {
      const response = await getBusinessMembers(businessId, {
        page: 1,
        limit: 100,
        status: "ACTIVE",
      });

      setMembers(normalizeMembers(response));
    } catch (err) {
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    if (!businessId) {
      return;
    }

    loadTeams();
    loadMembers();
  }, [businessId]);

  const filteredTeams = useMemo(() => {
    const query = search.trim().toLowerCase();

    return teams.filter((team) => {
      const name = String(team?.name || "").toLowerCase();

      const description = String(team?.description || "").toLowerCase();

      const manager = getManagerName(team).toLowerCase();

      const matchesSearch = !query || name.includes(query) || description.includes(query) || manager.includes(query);

      const status = getStatus(team);

      const matchesStatus = statusFilter === "ALL" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [teams, search, statusFilter, members]);

  const totalPages = Math.max(1, Math.ceil(filteredTeams.length / pageSize));

  const currentPage = Math.min(page, totalPages);

  const paginatedTeams = filteredTeams.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const stats = useMemo(() => {
    const total = teams.length;

    const active = teams.filter((team) => getStatus(team) === "ACTIVE").length;

    const inactive = teams.filter((team) => getStatus(team) === "INACTIVE").length;

    const suspended = teams.filter((team) => getStatus(team) === "SUSPENDED").length;

    return {
      total,
      active,
      inactive,
      suspended,
    };
  }, [teams]);

  const resetForm = () => {
    setTeamForm({
      name: "",
      description: "",
      managerId: "",
      memberIds: [],
      status: "ACTIVE",
    });

    setMemberSearch("");
    setManagerSearch("");
    setManagerOpen(false);
    setMembersOpen(false);
  };

  const openCreate = () => {
    resetForm();
    setModal("create");
  };

  const openView = async (team) => {
    setSaving(true);

    try {
      const response = await getTeam(businessId, team?._id || team?.id);

      const data = response?.data || response || {};

      const detail = data.team || data.item || data;

      const teamMembers = getTeamMembers(detail);

      setTeamForm({
        name: detail?.name || "",
        description: detail?.description || "",
        managerId: getManagerId(detail),
        memberIds: teamMembers.map((member) => getMemberId(member)).filter(Boolean),
        status: getStatus(detail),
      });

      setModal({
        type: "view",
        team: detail,
      });
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || "Unable to load team details.");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = async (team) => {
    setSaving(true);

    try {
      const response = await getTeam(businessId, team?._id || team?.id);

      const data = response?.data || response || {};

      const detail = data.team || data.item || data;

      const teamMembers = getTeamMembers(detail);

      setTeamForm({
        name: detail?.name || "",
        description: detail?.description || "",
        managerId: getManagerId(detail),
        memberIds: teamMembers.map((member) => getMemberId(member)).filter(Boolean),
        status: getStatus(detail),
      });

      setModal({
        type: "edit",
        team: detail,
      });
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || "Unable to load team details.");
    } finally {
      setSaving(false);
    }
  };

  const toggleMember = (memberId) => {
    setTeamForm((prev) => {
      const exists = prev.memberIds.some((id) => String(id) === String(memberId));

      return {
        ...prev,
        memberIds: exists ? prev.memberIds.filter((id) => String(id) !== String(memberId)) : [...prev.memberIds, memberId],
      };
    });
  };

  const saveTeam = async () => {
    const name = teamForm.name.trim();

    if (!name) {
      await showAuthAlert({
        icon: "warning",
        title: "Team name required",
        text: "Please enter a team name.",
        confirmButtonText: "OK",
      });

      return;
    }

    if (!businessId) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      let savedTeamId = "";

      if (modal === "create") {
        const payload = {
          name,
          description: teamForm.description.trim(),
          managerId: teamForm.managerId || null,
          status: teamForm.status || "ACTIVE",
        };

        const response = await createTeam(businessId, payload);

        const data = response?.data || response || {};

        const createdTeam = data.team || data.item || data;

        savedTeamId = createdTeam?._id || createdTeam?.id || data?._id || data?.id;

        if (savedTeamId && teamForm.memberIds.length > 0) {
          for (const memberId of teamForm.memberIds) {
            try {
              await addTeamMember(businessId, savedTeamId, memberId);
            } catch (memberError) {
              console.error("Unable to add team member:", memberError);
            }
          }
        }

        await showAuthAlert({
          icon: "success",
          title: "Team created",
          text: "Team created successfully.",
          confirmButtonText: "Done",
        });
      } else {
        const teamId = modal?.team?._id || modal?.team?.id;

        await updateTeam(businessId, teamId, {
          name,
          description: teamForm.description.trim(),
          managerId: teamForm.managerId || null,
          status: teamForm.status,
        });

        const oldMembers = getTeamMembers(modal?.team);

        const oldMemberIds = oldMembers.map((member) => getMemberId(member)).filter(Boolean);

        const newMemberIds = teamForm.memberIds || [];

        const toAdd = newMemberIds.filter((id) => !oldMemberIds.some((oldId) => String(oldId) === String(id)));

        const toRemove = oldMemberIds.filter((id) => !newMemberIds.some((newId) => String(newId) === String(id)));

        for (const memberId of toAdd) {
          try {
            await addTeamMember(businessId, teamId, memberId);
          } catch (memberError) {
            console.error("Unable to add team member:", memberError);
          }
        }

        for (const memberId of toRemove) {
          try {
            await removeTeamMember(businessId, teamId, memberId);
          } catch (memberError) {
            console.error("Unable to remove team member:", memberError);
          }
        }

        await showAuthAlert({
          icon: "success",
          title: "Team updated",
          text: "Team updated successfully.",
          confirmButtonText: "Done",
        });
      }

      setModal(null);
      resetForm();

      await loadTeams();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Unable to save team.";

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: "Unable to save",
        text: message,
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const removeTeam = async (team) => {
    const result = await showAuthAlert({
      icon: "warning",
      title: "Delete team?",
      text: `Are you sure you want to delete "${team?.name || "this team"}"?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) {
      return;
    }

    try {
      setSaving(true);

      await deleteTeam(businessId, team?._id || team?.id);

      await loadTeams();

      await showAuthAlert({
        icon: "success",
        title: "Team deleted",
        text: "Team deleted successfully.",
        confirmButtonText: "Done",
      });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Unable to delete team.";

      await showAuthAlert({
        icon: "error",
        title: "Delete failed",
        text: message,
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredMembers = useMemo(() => {
    const query = memberSearch.trim().toLowerCase();

    if (!query) {
      return members;
    }

    return members.filter((member) => {
      const name = getMemberName(member).toLowerCase();

      const email = getMemberEmail(member).toLowerCase();

      const phone = getMemberPhone(member).toLowerCase();

      return name.includes(query) || email.includes(query) || phone.includes(query);
    });
  }, [members, memberSearch]);

  const filteredManagers = useMemo(() => {
    const query = managerSearch.trim().toLowerCase();

    if (!query) {
      return members;
    }

    return members.filter((member) => {
      const name = getMemberName(member).toLowerCase();

      const email = getMemberEmail(member).toLowerCase();

      return name.includes(query) || email.includes(query);
    });
  }, [members, managerSearch]);

  const selectedManager = members.find((member) => String(getMemberId(member)) === String(teamForm.managerId));

  const selectedMembers = members.filter((member) => teamForm.memberIds.some((id) => String(id) === String(getMemberId(member))));

  const statusClass = (status) => {
    const value = String(status || "ACTIVE").toUpperCase();

    if (value === "INACTIVE") {
      return "team-page-status team-page-status-inactive";
    }

    if (value === "SUSPENDED") {
      return "team-page-status team-page-status-suspended";
    }

    return "team-page-status team-page-status-active";
  };

  const renderAvatar = (member, size = 38) => {
    const image = getMemberImage(member);

    if (image) {
      return (
        <img
          src={image}
          alt=""
          className="team-page-avatar"
          style={{
            width: size,
            height: size,
          }}
        />
      );
    }

    return (
      <div
        className="team-page-avatar team-page-avatar-fallback"
        style={{
          width: size,
          height: size,
        }}>
        <UserRound size={size * 0.45} />
      </div>
    );
  };

  return (
    <div className="team-page">
      <style>{`.team-page{padding:24px 26px;color:var(--crm-text);min-width:0}.team-page *{box-sizing:border-box}.team-page-header{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:18px}.team-page-header-left{min-width:0}.team-page-title{font-size:26px;line-height:1.1;font-weight:400;margin:0;color:var(--crm-text)}.team-page-subtitle{font-size:13px;color:var(--crm-muted);margin:8px 0 0}.team-page-header-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}.team-page-btn{height:40px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);padding:0 13px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer;transition:.15s ease}.team-page-btn:hover{border-color:var(--crm-primary);background:var(--crm-surface-2)}.team-page-btn-primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.team-page-btn-primary:hover{opacity:.92;background:var(--crm-primary);border-color:var(--crm-primary)}.team-page-btn:disabled{opacity:.55;cursor:not-allowed}.team-page-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:14px}.team-page-stat{min-height:124px;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;padding:18px 17px;display:flex;align-items:center;justify-content:space-between;gap:12px}.team-page-stat-copy{min-width:0}.team-page-stat-label{font-size:13px;font-weight:400;color:var(--crm-muted);margin-bottom:8px}.team-page-stat-number{font-size:27px;line-height:1;font-weight:400;color:var(--crm-text)}.team-page-stat-note{font-size:13px;color:var(--crm-muted);margin-top:8px}.team-page-stat-icon{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.team-page-stat-total .team-page-stat-icon{color:#8b87ff;background:rgba(89,71,216,.2)}.team-page-stat-active .team-page-stat-icon{color:#35d98a;background:rgba(22,163,74,.16)}.team-page-stat-inactive .team-page-stat-icon{color:#f5b91f;background:rgba(180,120,0,.16)}.team-page-stat-suspended .team-page-stat-icon{color:#ff6d78;background:rgba(190,55,70,.14)}.team-page-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:14px}.team-page-search{position:relative;flex:0 1 680px;min-width:260px}.team-page-search>svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--crm-muted);pointer-events:none}.team-page-search input{width:100%;height:42px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface);color:var(--crm-text);padding:0 40px;font-size:13px;outline:none}.team-page-search input:focus{border-color:var(--crm-primary)}.team-page-search input::placeholder{color:var(--crm-muted)}.team-page-search-clear{position:absolute;right:9px;top:9px;width:24px;height:24px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;border-radius:6px}.team-page-search-clear:hover{background:var(--crm-surface-2);color:var(--crm-text)}.team-page-status-filter{height:42px;min-width:175px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface);color:var(--crm-text);padding:0 12px;font-size:13px;outline:none;cursor:pointer}.team-page-status-filter:focus{border-color:var(--crm-primary)}.team-page-table-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;overflow:hidden}.team-page-table-wrap{width:100%;overflow-x:auto}.team-page-table{width:100%;min-width:820px;border-collapse:collapse}.team-page-table th{height:43px;padding:0 16px;text-align:left;background:var(--crm-surface-2);border-bottom:1px solid var(--crm-border);font-size:13px;font-weight:400;letter-spacing:.05em;text-transform:uppercase;color:var(--crm-muted);white-space:nowrap}.team-page-table td{padding:13px 16px;border-bottom:1px solid var(--crm-border);font-size:13px;color:var(--crm-text);vertical-align:middle}.team-page-table tbody tr:last-child td{border-bottom:0}.team-page-table tbody tr:hover{background:rgba(255,255,255,.015)}.team-page-team-name{font-size:13px;font-weight:400;color:var(--crm-text);line-height:1.25}.team-page-team-description{font-size:13px;color:var(--crm-muted);margin-top:5px;max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.team-page-manager{display:flex;align-items:center;gap:9px;min-width:150px}.team-page-avatar{border-radius:50%;object-fit:cover;display:block;flex-shrink:0}.team-page-avatar-fallback{border:1px solid var(--crm-border);background:var(--crm-surface-2);color:var(--crm-muted);display:grid;place-items:center}.team-page-manager-name{font-size:13px;font-weight:400;color:var(--crm-text);white-space:nowrap}.team-page-member-count{display:inline-flex;align-items:center;gap:7px;color:var(--crm-text);font-weight:400}.team-page-member-count svg{color:var(--crm-muted)}.team-page-status{display:inline-flex;align-items:center;justify-content:center;min-width:66px;height:26px;padding:0 9px;border-radius:8px;font-size:13px;font-weight:400;letter-spacing:.02em}.team-page-status-active{color:#35df8c;background:rgba(22,163,74,.16)}.team-page-status-inactive{color:#f6bd2b;background:rgba(180,120,0,.16)}.team-page-status-suspended{color:#ff727c;background:rgba(190,55,70,.15)}.team-page-actions{display:flex;align-items:center;gap:6px}.team-page-icon-btn{width:35px;height:35px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}.team-page-icon-btn:hover{color:var(--crm-text);border-color:var(--crm-primary);background:var(--crm-surface-2)}.team-page-icon-btn-danger:hover{color:#ff6d78;border-color:rgba(255,109,120,.45)}.team-page-empty{padding:52px 20px!important;text-align:center!important;color:var(--crm-muted)!important}.team-page-empty-icon{width:42px;height:42px;border-radius:12px;background:var(--crm-surface-2);margin:0 auto 10px;display:grid;place-items:center;color:var(--crm-muted)}.team-page-footer{min-height:74px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:15px}.team-page-total{font-size:13px;color:var(--crm-muted)}.team-page-pagination{display:flex;align-items:center;gap:8px}.team-page-page-text{font-size:13px;color:var(--crm-muted);min-width:66px;text-align:center}.team-page-page-btn{height:38px;padding:0 13px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);font-size:13px;font-weight:400;cursor:pointer}.team-page-page-btn:disabled{opacity:.45;cursor:not-allowed}.team-page-page-btn:hover:not(:disabled){border-color:var(--crm-primary);background:var(--crm-surface-2)}.team-page-alert{padding:10px 12px;border:1px solid rgba(255,109,120,.25);background:rgba(190,55,70,.08);color:#ff8a92;border-radius:10px;font-size:13px;margin-bottom:14px}.team-page-modal{position:fixed;inset:0;background:rgba(3,8,20,.68);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:1000}.team-page-dialog{width:min(650px,100%);max-height:calc(100vh - 40px);overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,.4)}.team-page-dialog-header{padding:18px 20px;border-bottom:1px solid var(--crm-border);display:flex;align-items:flex-start;justify-content:space-between;gap:15px}.team-page-dialog-title{font-size:17px;font-weight:400;margin:0;color:var(--crm-text)}.team-page-dialog-subtitle{font-size:13px;color:var(--crm-muted);margin:5px 0 0}.team-page-close{width:32px;height:32px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}.team-page-close:hover{color:var(--crm-text);background:var(--crm-surface-2)}.team-page-dialog-body{padding:20px}.team-page-field{margin-bottom:15px}.team-page-field:last-child{margin-bottom:0}.team-page-field label{display:block;font-size:13px;font-weight:400;color:var(--crm-text);margin-bottom:7px}.team-page-input,.team-page-textarea,.team-page-select{width:100%;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);outline:none;font-size:13px;padding:10px 11px}.team-page-input{height:40px}.team-page-textarea{min-height:84px;resize:vertical}.team-page-input:focus,.team-page-textarea:focus,.team-page-select:focus{border-color:var(--crm-primary)}.team-page-select{height:40px}.team-page-picker{position:relative}.team-page-picker-button{min-height:42px;width:100%;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:8px 35px 8px 10px;text-align:left;cursor:pointer;position:relative}.team-page-picker-button>svg{position:absolute;right:11px;top:50%;transform:translateY(-50%);color:var(--crm-muted)}.team-page-selected-person{display:flex;align-items:center;gap:9px}.team-page-selected-person-name{font-size:13px;font-weight:400}.team-page-selected-person-email{font-size:13px;color:var(--crm-muted);margin-top:2px}.team-page-dropdown{position:absolute;left:0;right:0;top:calc(100% + 6px);background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 18px 45px rgba(0,0,0,.35);z-index:20;overflow:hidden}.team-page-dropdown-search{padding:8px;border-bottom:1px solid var(--crm-border)}.team-page-dropdown-search input{width:100%;height:35px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface-2);color:var(--crm-text);padding:0 10px;font-size:13px;outline:none}.team-page-dropdown-list{max-height:220px;overflow-y:auto;padding:5px}.team-page-person-option{width:100%;border:0;background:transparent;color:var(--crm-text);padding:8px;border-radius:8px;display:flex;align-items:center;gap:9px;text-align:left;cursor:pointer}.team-page-person-option:hover{background:var(--crm-surface-2)}.team-page-person-option-name{font-size:13px;font-weight:400}.team-page-person-option-email{font-size:13px;color:var(--crm-muted);margin-top:2px}.team-page-no-users{padding:18px;text-align:center;color:var(--crm-muted);font-size:13px}.team-page-selected-members{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.team-page-member-chip{display:inline-flex;align-items:center;gap:5px;height:27px;padding:0 8px;border-radius:7px;background:var(--crm-surface-2);border:1px solid var(--crm-border);font-size:13px;color:var(--crm-text)}.team-page-member-chip button{border:0;background:transparent;color:var(--crm-muted);padding:0;display:grid;place-items:center;cursor:pointer}.team-page-member-list{max-height:230px;overflow-y:auto;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface)}.team-page-member-row{display:flex;align-items:center;gap:9px;padding:9px 10px;border-bottom:1px solid var(--crm-border);cursor:pointer}.team-page-member-row:last-child{border-bottom:0}.team-page-member-row:hover{background:var(--crm-surface-2)}.team-page-member-row input{accent-color:var(--crm-primary)}.team-page-member-row-copy{min-width:0}.team-page-member-row-name{font-size:13px;font-weight:400;color:var(--crm-text)}.team-page-member-row-email{font-size:13px;color:var(--crm-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.team-page-dialog-footer{padding:14px 20px;border-top:1px solid var(--crm-border);display:flex;justify-content:flex-end;gap:8px}.team-page-view-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.team-page-view-box{border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface-2);padding:12px}.team-page-view-label{font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--crm-muted);font-weight:400;margin-bottom:6px}.team-page-view-value{font-size:13px;color:var(--crm-text);font-weight:400}.team-page-view-description{font-size:13px;color:var(--crm-text);line-height:1.55}.team-page-view-members{display:flex;flex-direction:column;gap:8px;max-height:220px;overflow:auto}.team-page-view-member{display:flex;align-items:center;gap:9px}.team-page-loading{display:flex;align-items:center;justify-content:center;gap:8px;color:var(--crm-muted);font-size:13px;padding:30px}.team-page-spinner{animation:team-page-spin 1s linear infinite}@keyframes team-page-spin{to{transform:rotate(360deg)}}@media(max-width:900px){.team-page-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.team-page-header{align-items:flex-start}.team-page-toolbar{flex-wrap:wrap}.team-page-search{flex:1 1 100%}.team-page-status-filter{flex:0 0 175px}}@media(max-width:600px){.team-page{padding:18px 14px}.team-page-header{flex-direction:column}.team-page-header-actions{width:100%}.team-page-header-actions .team-page-btn{flex:1}.team-page-stats{grid-template-columns:1fr}.team-page-view-grid{grid-template-columns:1fr}.team-page-footer{align-items:flex-start;flex-direction:column}.team-page-pagination{width:100%;justify-content:space-between}}`}</style>

      <div className="team-page-header">
        <div className="team-page-header-left">
          <h1 className="team-page-title">Team</h1>

          <p className="team-page-subtitle">Manage teams, managers and team members.</p>
        </div>

        <div className="team-page-header-actions">
          <button
            className="team-page-btn"
            onClick={() => {
              loadTeams();
              loadMembers();
            }}
            disabled={loading}>
            <RefreshCw size={15} className={loading ? "team-page-spinner" : ""} />
            Refresh
          </button>

          {canManage && (
            <button className="team-page-btn team-page-btn-primary" onClick={openCreate}>
              <Plus size={16} />
              Add Team
            </button>
          )}
        </div>
      </div>

      {(error || businessError) && <div className="team-page-alert">{error || businessError}</div>}

      <div className="team-page-stats">
        <div className="team-page-stat team-page-stat-total">
          <div className="team-page-stat-copy">
            <div className="team-page-stat-label">Total Teams</div>

            <div className="team-page-stat-number">{stats.total}</div>

            <div className="team-page-stat-note">All business teams</div>
          </div>

          <div className="team-page-stat-icon">
            <UsersRound size={22} />
          </div>
        </div>

        <div className="team-page-stat team-page-stat-active">
          <div className="team-page-stat-copy">
            <div className="team-page-stat-label">Active</div>

            <div className="team-page-stat-number">{stats.active}</div>

            <div className="team-page-stat-note">Currently active</div>
          </div>

          <div className="team-page-stat-icon">
            <Check size={22} />
          </div>
        </div>

        <div className="team-page-stat team-page-stat-inactive">
          <div className="team-page-stat-copy">
            <div className="team-page-stat-label">Inactive</div>

            <div className="team-page-stat-number">{stats.inactive}</div>

            <div className="team-page-stat-note">Currently inactive</div>
          </div>

          <div className="team-page-stat-icon">
            <UserRound size={22} />
          </div>
        </div>

        <div className="team-page-stat team-page-stat-suspended">
          <div className="team-page-stat-copy">
            <div className="team-page-stat-label">Suspended</div>

            <div className="team-page-stat-number">{stats.suspended}</div>

            <div className="team-page-stat-note">Currently suspended</div>
          </div>

          <div className="team-page-stat-icon">
            <Ban size={22} />
          </div>
        </div>
      </div>

      <div className="team-page-toolbar">
        <div className="team-page-search">
          <Search size={17} />

          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search teams..."
          />

          {search && (
            <button
              className="team-page-search-clear"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}>
              <X size={15} />
            </button>
          )}
        </div>

        <select
          className="team-page-status-filter"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}>
          <option value="ALL">All Status</option>

          <option value="ACTIVE">Active</option>

          <option value="INACTIVE">Inactive</option>

          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      <div className="team-page-table-card">
        <div className="team-page-table-wrap">
          <table className="team-page-table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Manager</th>
                <th>Members</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading || businessLoading ? (
                <tr>
                  <td colSpan="5" className="team-page-empty">
                    <div className="team-page-loading">
                      <RefreshCw size={16} className="team-page-spinner" />
                      Loading teams...
                    </div>
                  </td>
                </tr>
              ) : paginatedTeams.length === 0 ? (
                <tr>
                  <td colSpan="5" className="team-page-empty">
                    <div className="team-page-empty-icon">
                      <UsersRound size={19} />
                    </div>
                    No teams found.
                  </td>
                </tr>
              ) : (
                paginatedTeams.map((team) => {
                  const teamId = team?._id || team?.id;

                  const manager = getManager(team);

                  return (
                    <tr key={teamId}>
                      <td>
                        <div className="team-page-team-name">{team?.name || "Unnamed Team"}</div>

                        {team?.description && <div className="team-page-team-description">{team.description}</div>}
                      </td>

                      <td>
                        <div className="team-page-manager">
                          {manager ? (
                            renderAvatar(manager)
                          ) : (
                            <div className="team-page-avatar team-page-avatar-fallback">
                              <UserRound size={17} />
                            </div>
                          )}

                          <div className="team-page-manager-name">{getManagerName(team)}</div>
                        </div>
                      </td>

                      <td>
                        <span className="team-page-member-count">
                          <UsersRound size={16} />

                          {getTeamMemberCount(team)}
                        </span>
                      </td>

                      <td>
                        <span className={statusClass(team?.status)}>{getStatus(team)}</span>
                      </td>

                      <td>
                        <div className="team-page-actions">
                          <button className="team-page-icon-btn" title="View" onClick={() => openView(team)}>
                            <Eye size={15} />
                          </button>

                          {canManage && (
                            <button className="team-page-icon-btn" title="Edit" onClick={() => openEdit(team)}>
                              <Pencil size={15} />
                            </button>
                          )}

                          {canManage && (
                            <button className="team-page-icon-btn team-page-icon-btn-danger" title="Delete" onClick={() => removeTeam(team)}>
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="team-page-footer">
          <div className="team-page-total">{filteredTeams.length} total</div>

          <div className="team-page-pagination">
            <button className="team-page-page-btn" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(value - 1, 1))}>
              <ChevronLeft
                size={14}
                style={{
                  verticalAlign: "middle",
                  marginRight: 3,
                }}
              />
              Previous
            </button>

            <div className="team-page-page-text">
              Page {currentPage} / {totalPages}
            </div>

            <button className="team-page-page-btn" disabled={currentPage >= totalPages} onClick={() => setPage((value) => Math.min(value + 1, totalPages))}>
              Next
              <ChevronRight
                size={14}
                style={{
                  verticalAlign: "middle",
                  marginLeft: 3,
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <div
          className="team-page-modal"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModal(null);
              resetForm();
            }
          }}>
          <div className="team-page-dialog">
            <div className="team-page-dialog-header">
              <div>
                <h2 className="team-page-dialog-title">{modal === "create" ? "Add Team" : modal?.type === "view" ? "Team Details" : "Edit Team"}</h2>

                <p className="team-page-dialog-subtitle">{modal === "create" ? "Create a team and assign business members." : "Manage team information and members."}</p>
              </div>

              <button
                className="team-page-close"
                onClick={() => {
                  setModal(null);
                  resetForm();
                }}>
                <X size={16} />
              </button>
            </div>

            {modal?.type === "view" ? (
              <>
                <div className="team-page-dialog-body">
                  <div className="team-page-view-grid">
                    <div className="team-page-view-box">
                      <div className="team-page-view-label">Team</div>

                      <div className="team-page-view-value">{teamForm.name || "Unnamed Team"}</div>
                    </div>

                    <div className="team-page-view-box">
                      <div className="team-page-view-label">Status</div>

                      <span className={statusClass(teamForm.status)}>{teamForm.status}</span>
                    </div>

                    <div className="team-page-view-box">
                      <div className="team-page-view-label">Manager</div>

                      <div className="team-page-view-value">{selectedManager ? getMemberName(selectedManager) : "Unassigned"}</div>
                    </div>

                    <div className="team-page-view-box">
                      <div className="team-page-view-label">Members</div>

                      <div className="team-page-view-value">{teamForm.memberIds.length}</div>
                    </div>
                  </div>

                  <div
                    className="team-page-view-box"
                    style={{
                      marginTop: 12,
                    }}>
                    <div className="team-page-view-label">Description</div>

                    <div className="team-page-view-description">{teamForm.description || "No description added."}</div>
                  </div>

                  <div
                    className="team-page-view-box"
                    style={{
                      marginTop: 12,
                    }}>
                    <div className="team-page-view-label">Team Members</div>

                    {selectedMembers.length === 0 ? (
                      <div className="team-page-no-users">No members assigned.</div>
                    ) : (
                      <div className="team-page-view-members">
                        {selectedMembers.map((member) => (
                          <div className="team-page-view-member" key={getMemberId(member)}>
                            {renderAvatar(member, 30)}

                            <div>
                              <div className="team-page-person-option-name">{getMemberName(member)}</div>

                              <div className="team-page-person-option-email">{getMemberEmail(member)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="team-page-dialog-footer">
                  <button
                    className="team-page-btn"
                    onClick={() => {
                      setModal(null);
                      resetForm();
                    }}>
                    Close
                  </button>

                  <button className="team-page-btn team-page-btn-primary" onClick={() => openEdit(modal.team)}>
                    <Pencil size={14} />
                    Edit Team
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="team-page-dialog-body">
                  <div className="team-page-field">
                    <label>Team name</label>

                    <input
                      className="team-page-input"
                      value={teamForm.name}
                      onChange={(event) =>
                        setTeamForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Enter team name"
                    />
                  </div>

                  <div className="team-page-field">
                    <label>Description</label>

                    <textarea
                      className="team-page-textarea"
                      value={teamForm.description}
                      onChange={(event) =>
                        setTeamForm((prev) => ({
                          ...prev,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Enter team description"
                    />
                  </div>

                  <div className="team-page-field">
                    <label>Manager</label>

                    <div className="team-page-picker">
                      <button
                        type="button"
                        className="team-page-picker-button"
                        onClick={() => {
                          setManagerOpen((value) => !value);
                          setMembersOpen(false);
                        }}>
                        {selectedManager ? (
                          <div className="team-page-selected-person">
                            {renderAvatar(selectedManager, 28)}

                            <div>
                              <div className="team-page-selected-person-name">{getMemberName(selectedManager)}</div>

                              <div className="team-page-selected-person-email">{getMemberEmail(selectedManager)}</div>
                            </div>
                          </div>
                        ) : (
                          <span
                            style={{
                              color: "var(--crm-muted)",
                              fontSize: 12,
                            }}>
                            Select manager
                          </span>
                        )}

                        <ChevronDown size={16} />
                      </button>

                      {managerOpen && (
                        <div className="team-page-dropdown">
                          <div className="team-page-dropdown-search">
                            <input value={managerSearch} onChange={(event) => setManagerSearch(event.target.value)} placeholder="Search member..." autoFocus />
                          </div>

                          <div className="team-page-dropdown-list">
                            <button
                              type="button"
                              className="team-page-person-option"
                              onClick={() => {
                                setTeamForm((prev) => ({
                                  ...prev,
                                  managerId: "",
                                }));

                                setManagerOpen(false);

                                setManagerSearch("");
                              }}>
                              <div className="team-page-avatar team-page-avatar-fallback">
                                <X size={15} />
                              </div>

                              <div>
                                <div className="team-page-person-option-name">Unassigned</div>

                                <div className="team-page-person-option-email">No manager</div>
                              </div>
                            </button>

                            {membersLoading ? (
                              <div className="team-page-no-users">Loading members...</div>
                            ) : filteredManagers.length === 0 ? (
                              <div className="team-page-no-users">No members found.</div>
                            ) : (
                              filteredManagers.map((member) => {
                                const memberId = getMemberId(member);

                                return (
                                  <button
                                    type="button"
                                    className="team-page-person-option"
                                    key={memberId}
                                    onClick={() => {
                                      setTeamForm((prev) => ({
                                        ...prev,
                                        managerId: memberId,
                                      }));

                                      setManagerOpen(false);

                                      setManagerSearch("");
                                    }}>
                                    {renderAvatar(member, 30)}

                                    <div>
                                      <div className="team-page-person-option-name">{getMemberName(member)}</div>

                                      <div className="team-page-person-option-email">{getMemberEmail(member)}</div>
                                    </div>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="team-page-field">
                    <label>Team Members</label>

                    <div className="team-page-picker">
                      <button
                        type="button"
                        className="team-page-picker-button"
                        onClick={() => {
                          setMembersOpen((value) => !value);
                          setManagerOpen(false);
                        }}>
                        <span
                          style={{
                            color: teamForm.memberIds.length ? "var(--crm-text)" : "var(--crm-muted)",
                            fontSize: 12,
                          }}>
                          {teamForm.memberIds.length ? `${teamForm.memberIds.length} member${teamForm.memberIds.length > 1 ? "s" : ""} selected` : "Select team members"}
                        </span>

                        <ChevronDown size={16} />
                      </button>

                      {membersOpen && (
                        <div className="team-page-dropdown">
                          <div className="team-page-dropdown-search">
                            <input value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} placeholder="Search member by name, email or phone..." autoFocus />
                          </div>

                          <div className="team-page-member-list">
                            {membersLoading ? (
                              <div className="team-page-no-users">Loading members...</div>
                            ) : filteredMembers.length === 0 ? (
                              <div className="team-page-no-users">No business members found.</div>
                            ) : (
                              filteredMembers.map((member) => {
                                const memberId = getMemberId(member);

                                const selected = teamForm.memberIds.some((id) => String(id) === String(memberId));

                                return (
                                  <label className="team-page-member-row" key={memberId}>
                                    <input type="checkbox" checked={selected} onChange={() => toggleMember(memberId)} />

                                    {renderAvatar(member, 30)}

                                    <div className="team-page-member-row-copy">
                                      <div className="team-page-member-row-name">{getMemberName(member)}</div>

                                      <div className="team-page-member-row-email">{getMemberEmail(member)}</div>
                                    </div>
                                  </label>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedMembers.length > 0 && (
                      <div className="team-page-selected-members">
                        {selectedMembers.map((member) => (
                          <span className="team-page-member-chip" key={getMemberId(member)}>
                            {getMemberName(member)}

                            <button type="button" onClick={() => toggleMember(getMemberId(member))}>
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="team-page-field">
                    <label>Status</label>

                    <select
                      className="team-page-select"
                      value={teamForm.status}
                      onChange={(event) =>
                        setTeamForm((prev) => ({
                          ...prev,
                          status: event.target.value,
                        }))
                      }>
                      <option value="ACTIVE">Active</option>

                      <option value="INACTIVE">Inactive</option>

                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="team-page-dialog-footer">
                  <button
                    className="team-page-btn"
                    disabled={saving}
                    onClick={() => {
                      setModal(null);
                      resetForm();
                    }}>
                    Cancel
                  </button>

                  <button className="team-page-btn team-page-btn-primary" disabled={saving} onClick={saveTeam}>
                    {saving ? (
                      <>
                        <RefreshCw size={14} className="team-page-spinner" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        {modal === "create" ? "Create Team" : "Save Changes"}
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
