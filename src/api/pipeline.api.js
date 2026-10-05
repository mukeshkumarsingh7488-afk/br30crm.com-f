import api from "./api";

export const getPipelines = async (businessId, params = {}) => {
  const response = await api.get(`/pipelines/business/${businessId}`, {
    params,
  });

  return response.data;
};

export const getPipelineById = async (businessId, pipelineId) => {
  const response = await api.get(`/pipelines/business/${businessId}/${pipelineId}`);

  return response.data;
};

export const createPipeline = async (businessId, data) => {
  const response = await api.post(`/pipelines/business/${businessId}`, data);

  return response.data;
};

export const updatePipeline = async (businessId, pipelineId, data) => {
  const response = await api.patch(`/pipelines/business/${businessId}/${pipelineId}`, data);

  return response.data;
};

export const deletePipeline = async (businessId, pipelineId) => {
  const response = await api.delete(`/pipelines/business/${businessId}/${pipelineId}`);

  return response.data;
};

export const addPipelineStage = async (businessId, pipelineId, data) => {
  const response = await api.post(`/pipelines/business/${businessId}/${pipelineId}/stages`, data);

  return response.data;
};

export const updatePipelineStage = async (businessId, pipelineId, stageId, data) => {
  const response = await api.patch(`/pipelines/business/${businessId}/${pipelineId}/stages/${stageId}`, data);

  return response.data;
};

export const deletePipelineStage = async (businessId, pipelineId, stageId) => {
  const response = await api.delete(`/pipelines/business/${businessId}/${pipelineId}/stages/${stageId}`);

  return response.data;
};
