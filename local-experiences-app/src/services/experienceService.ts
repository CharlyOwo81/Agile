import axios from 'axios';
import type { Experience, CreateExperienceData } from '../types/Experience';

const API_URL = 'http://localhost:3000/experiences';

// Función auxiliar para obtener el token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const experienceService = {
  getMyExperiences: async (): Promise<Experience[]> => {
    const response = await axios.get(`${API_URL}/my-experiences`, getAuthHeader());
    return response.data;
  },

  getAllExperiences: async (): Promise<Experience[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  createExperience: async (data: CreateExperienceData): Promise<Experience> => {
    const response = await axios.post(API_URL, data, getAuthHeader());
    return response.data;
  },

  deleteExperience: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  }
};