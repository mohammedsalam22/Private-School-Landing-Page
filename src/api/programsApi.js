import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

class ProgramsApi {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async fetchPrograms() {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.PROGRAMS}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  }

  getImageUrl(imagePath) {
    return `${this.baseURL}/storage/${imagePath}`;
  }
}

export default new ProgramsApi(); 