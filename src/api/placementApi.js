import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

class PlacementApi {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async fetchPlacementDates() {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.PLACEMENT_DATES}?future=1&limit_reached=0`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching placement dates:', error);
      throw error;
    }
  }

  async submitPlacementTest(formData) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.PLACEMENT_SUBMIT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting placement test:', error);
      throw error;
    }
  }
}

export default new PlacementApi(); 