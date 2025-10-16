// frontend/daily_application/src/api.js

const API_URL = 'http://localhost:3000/api'; // Adjust the URL if your backend runs on a different port

export const getAllCustomers = async () => {
  try {
    const response = await fetch(`${API_URL}/customers`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};