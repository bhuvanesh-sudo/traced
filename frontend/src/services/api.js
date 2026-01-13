import axios from 'axios';

// Point to your backend URL
const API_URL = 'http://localhost:5000/api/game';

export const getShapes = async () => {
  try {
    const response = await axios.get(`${API_URL}/shapes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shapes:", error);
    return [];
  }
};

export const submitAttempt = async (attemptData) => {
  try {
    const response = await axios.post(`${API_URL}/attempt`, attemptData);
    return response.data;
  } catch (error) {
    console.error("Error submitting attempt:", error);
    throw error;
  }
};