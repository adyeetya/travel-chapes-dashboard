import axios from 'axios';
import { getToken } from '@/utils/auth';
import { ServerUrl } from '@/app/config';

// POST /api/v1/subAdmin/createSubAdmin
export const createSubAdmin = async (subAdminData) => {
  try {
    const response = await axios.post(`${ServerUrl}/subAdmin/createSubAdmin`, subAdminData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// GET /api/v1/subAdmin/viewSubadmin
export const viewSubadmin = async (subAdminId) => {
  try {
    const response = await axios.get(`${ServerUrl}/subAdmin/viewSubadmin`, {
      params: { _id: subAdminId },
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// GET /api/v1/subAdmin/getsubAdmins
export const getSubAdmins = async () => {
  try {
    const response = await axios.get(`${ServerUrl}/subAdmin/getsubAdmins`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// PUT /api/v1/subAdmin/updateSubadmin
export const updateSubadmin = async (subAdminData) => {
  try {
    const response = await axios.put(`${ServerUrl}/subAdmin/updateSubadmin`, subAdminData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// DELETE /api/v1/subAdmin/deleteSubadmin
export const deleteSubadmin = async (subAdminId) => {
  try {
    const response = await axios.delete(`${ServerUrl}/subAdmin/deleteSubadmin`, {
      data: { _id: subAdminId },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};