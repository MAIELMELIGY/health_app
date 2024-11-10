import api from '../services/api';


export const handleRequest = async (apiCall) => {
  try {
    const response = await apiCall();
    return response; 
  } catch (error) {
    if (error.response) {
      throw error.response.data || error.response;
    } else {
      throw new Error('Network error or unexpected issue.');
    }
  }
};

// Authentication Endpoints
export const login = (data) => handleRequest(() => api.post('/auth/login', data));
export const register = (data) => handleRequest(() => api.post('/auth/register', data));

// Patient Endpoints
export const bookVisit = (data) => handleRequest(() => api.post('/patient/book', data));
export const viewVisits = () => handleRequest(() => api.get('/patient/view-visits'));
export const listDoctors = () => handleRequest(() => api.get('/patient/list-doctors'));

// Doctor Endpoints
export const viewDoctorVisits = () => handleRequest(() => api.get('/finance/search-visits'));
export const startVisit = (visitId) => handleRequest(() => api.post('/doctor/start-visit', { visitId }));
export const addTreatment = (visitId, description, value) =>
  handleRequest(() => api.post('/doctor/add-treatment', { visitId, description, value }));
export const completeVisit = (visitId) => handleRequest(() => api.post('/doctor/complete-visit', { visitId }));

// Finance Endpoints
export const searchVisits = (criteria) => handleRequest(() => api.get('/finance/search-visits', { params: criteria }));
export const reviewVisit = (visitId) => handleRequest(() => api.get(`/finance/review-visit/${visitId}`));
export const viewVisitDetails = (visitId) =>
    handleRequest(() => api.get(`/finance/review-visit/${visitId}`));
  