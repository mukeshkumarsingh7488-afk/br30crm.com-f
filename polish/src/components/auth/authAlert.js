import Swal from "sweetalert2";

const getThemeConfig = () => {
  const theme = document.documentElement.getAttribute("data-theme");

  const isDark = theme === "dark" || (!theme && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return {
    background: isDark ? "#101827" : "#ffffff",
    color: isDark ? "#f3f5f9" : "#172033",
    confirmButtonColor: isDark ? "#818cf8" : "#4f46e5",
    cancelButtonColor: isDark ? "#263247" : "#e5e7eb",
    borderColor: isDark ? "#263247" : "#e5e7eb",
    mutedColor: isDark ? "#9aa8bd" : "#667085",
  };
};

const showAuthAlert = async ({ icon = "info", title = "", text = "", html = "", timer, showConfirmButton = true, confirmButtonText = "OK", cancelButtonText = "Cancel", showCancelButton = false, allowOutsideClick = true, allowEscapeKey = true, position = "center", ...options } = {}) => {
  const theme = getThemeConfig();

  return Swal.fire({
    icon,
    title,
    text,
    html,

    timer,
    position,

    showConfirmButton,
    confirmButtonText,

    showCancelButton,
    cancelButtonText,

    allowOutsideClick,
    allowEscapeKey,

    background: theme.background,
    color: theme.color,

    confirmButtonColor: theme.confirmButtonColor,
    cancelButtonColor: theme.cancelButtonColor,

    buttonsStyling: true,

    customClass: {
      popup: "br30-auth-swal-popup",
      title: "br30-auth-swal-title",
      htmlContainer: "br30-auth-swal-content",
      confirmButton: "br30-auth-swal-confirm",
      cancelButton: "br30-auth-swal-cancel",
      icon: "br30-auth-swal-icon",
      actions: "br30-auth-swal-actions",
    },

    backdrop: "rgba(15, 23, 42, 0.48)",

    ...options,
  });
};

const showAuthSuccess = (title, text = "", options = {}) => {
  return showAuthAlert({
    icon: "success",
    title,
    text,
    ...options,
  });
};

const showAuthError = (title, text = "", options = {}) => {
  return showAuthAlert({
    icon: "error",
    title,
    text,
    ...options,
  });
};

const showAuthWarning = (title, text = "", options = {}) => {
  return showAuthAlert({
    icon: "warning",
    title,
    text,
    ...options,
  });
};

const showAuthInfo = (title, text = "", options = {}) => {
  return showAuthAlert({
    icon: "info",
    title,
    text,
    ...options,
  });
};

export { showAuthAlert, showAuthSuccess, showAuthError, showAuthWarning, showAuthInfo };

export default showAuthAlert;
