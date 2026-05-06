import axios from 'axios';

// Base axios instance for admin API calls
const adminApi = axios.create({
  baseURL: '/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
adminApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access to admin API');
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    const { data } = await adminApi.get('/dashboard');
    return data;
  },
};

// Users API
export const usersApi = {
  getUsers: async (params: {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await adminApi.get('/users', { params });
    return data;
  },
  
  getUser: async (id: string) => {
    const { data } = await adminApi.get(`/users/${id}`);
    return data;
  },
  
  createUser: async (userData: any) => {
    const { data } = await adminApi.post('/users', userData);
    return data;
  },
  
  updateUser: async (id: string, userData: any) => {
    const { data } = await adminApi.put(`/users/${id}`, userData);
    return data;
  },
  
  deleteUser: async (id: string) => {
    const { data } = await adminApi.delete(`/users/${id}`);
    return data;
  },
};

// Bookings API
export const bookingsApi = {
  getBookings: async (params: {
    centerId?: string;
    search?: string;
    date?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await adminApi.get('/bookings', { params });
    return data;
  },
  
  getBooking: async (id: string) => {
    const { data } = await adminApi.get(`/bookings/${id}`);
    return data;
  },
  
  updateBooking: async (id: string, bookingData: any) => {
    const { data } = await adminApi.put(`/bookings/${id}`, bookingData);
    return data;
  },
  
  cancelBooking: async (id: string) => {
    const { data } = await adminApi.patch(`/bookings/${id}/cancel`);
    return data;
  },
  
  syncPayments: async () => {
    const { data } = await adminApi.post('/sync-payments');
    return data;
  },
};

// Centers API
export const centersApi = {
  getCenters: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await adminApi.get('/centers', { params });
    return data;
  },
  
  getCenter: async (id: string) => {
    const { data } = await adminApi.get(`/centers/${id}`);
    return data;
  },
  
  createCenter: async (centerData: any) => {
    const { data } = await adminApi.post('/centers', centerData);
    return data;
  },
  
  updateCenter: async (id: string, centerData: any) => {
    const { data } = await adminApi.put(`/centers/${id}`, centerData);
    return data;
  },
  
  deleteCenter: async (id: string) => {
    const { data } = await adminApi.delete(`/centers/${id}`);
    return data;
  },
};

// Treatments API
export const treatmentsApi = {
  getTreatments: async (params?: {
    search?: string;
    centerId?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await adminApi.get('/treatments', { params });
    return data;
  },
  
  getTreatment: async (id: string) => {
    const { data } = await adminApi.get(`/treatments/${id}`);
    return data;
  },
  
  createTreatment: async (treatmentData: any) => {
    const { data } = await adminApi.post('/treatments', treatmentData);
    return data;
  },
  
  updateTreatment: async (id: string, treatmentData: any) => {
    const { data } = await adminApi.put(`/treatments/${id}`, treatmentData);
    return data;
  },
  
  deleteTreatment: async (id: string) => {
    const { data } = await adminApi.delete(`/treatments/${id}`);
    return data;
  },
};

// Coachs API
export const specialistsApi = {
  getCoachs: async (params?: {
    search?: string;
    centerId?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await adminApi.get('/specialists', { params });
    return data;
  },
  
  getCoach: async (id: string) => {
    const { data } = await adminApi.get(`/specialists/${id}`);
    return data;
  },
  
  createCoach: async (specialistData: any) => {
    const { data } = await adminApi.post('/specialists', specialistData);
    return data;
  },
  
  updateCoach: async (id: string, specialistData: any) => {
    const { data } = await adminApi.put(`/specialists/${id}`, specialistData);
    return data;
  },
  
  deleteCoach: async (id: string) => {
    const { data } = await adminApi.delete(`/specialists/${id}`);
    return data;
  },
};

// Subscription Plans API
export const subscriptionPlansApi = {
  getSubscriptionPlans: async (params?: {
    search?: string;
    centerId?: string;
    status?: string;
    recurrence?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await adminApi.get('/subscription-plans', { params });
    return data;
  },
  
  getSubscriptionPlan: async (id: string) => {
    const { data } = await adminApi.get(`/subscription-plans/${id}`);
    return data;
  },
  
  createSubscriptionPlan: async (planData: any) => {
    const { data } = await adminApi.post('/subscription-plans', planData);
    return data;
  },
  
  updateSubscriptionPlan: async (id: string, planData: any) => {
    const { data } = await adminApi.put(`/subscription-plans/${id}`, planData);
    return data;
  },
  
  deleteSubscriptionPlan: async (id: string) => {
    const { data } = await adminApi.delete(`/subscription-plans/${id}`);
    return data;
  },
};

// User Subscriptions API
export const userSubscriptionsApi = {
  getUserSubscriptions: async (params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await adminApi.get('/user-subscriptions', { params });
    return data;
  },
  
  getUserSubscription: async (id: string) => {
    const { data } = await adminApi.get(`/user-subscriptions/${id}`);
    return data;
  },
  
  updateUserSubscription: async (id: string, subscriptionData: any) => {
    const { data } = await adminApi.put(`/user-subscriptions/${id}`, subscriptionData);
    return data;
  },
  
  cancelUserSubscription: async (id: string) => {
    const { data } = await adminApi.patch(`/user-subscriptions/${id}/cancel`);
    return data;
  },
};

// Payment Links API
export const paymentLinksApi = {
  getPaymentLinks: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await adminApi.get('/payment-links', { params });
    return data;
  },
  
  getPaymentLink: async (id: string) => {
    const { data } = await adminApi.get(`/payment-links/${id}`);
    return data;
  },
  
  createPaymentLink: async (linkData: any) => {
    const { data } = await adminApi.post('/payment-links', linkData);
    return data;
  },
  
  updatePaymentLink: async (id: string, linkData: any) => {
    const { data } = await adminApi.put(`/payment-links/${id}`, linkData);
    return data;
  },
  
  deletePaymentLink: async (id: string) => {
    const { data } = await adminApi.delete(`/payment-links/${id}`);
    return data;
  },
};

// Mailing API
export const mailingApi = {
  sendEmail: async (emailData: {
    recipients: string[];
    templateId: string;
    subject: string;
    data?: any;
  }) => {
    const { data } = await adminApi.post('/mailing/send', emailData);
    return data;
  },
  
  getEmailTemplates: async () => {
    const { data } = await adminApi.get('/mailing/templates');
    return data;
  },
};

export default adminApi;