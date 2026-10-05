import api from "./api";

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const verifyEmail = async (data) => {
  const response = await api.post("/auth/verify-email", data);
  return response.data;
};

export const resendOtp = async (data) => {
  const response = await api.post("/auth/resend-otp", data);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const verifyResetOtp = async (data) => {
  const response = await api.post("/auth/verify-reset-otp", data);
  return response.data;
};

export const resendResetOtp = async (data) => {
  const response = await api.post("/auth/resend-reset-otp", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.patch("/auth/profile", data);
  return response.data;
};

export const removeProfileImage = async () => {
  const response = await api.delete("/auth/profile/image");
  return response.data;
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};
