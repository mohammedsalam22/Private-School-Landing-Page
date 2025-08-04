import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

class VisitsApi {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async fetchVisitDates() {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.VISIT_DATES}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching visit dates:', error);
      throw error;
    }
  }

  async scheduleVisit(visitData) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.SCHEDULE_VISIT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error scheduling visit:', error);
      throw error;
    }
  }
}

export default new VisitsApi(); 