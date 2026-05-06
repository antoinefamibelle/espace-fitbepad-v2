import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL

// Create base axios instance
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const internalInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  _instance: instance,

  // Method for GET requests
  async get<T = any>(url: string, config?: any): Promise<any> {
    return instance.get<T>(url, config);
  },

  // Method for POST requests
  async post<T = any>(url: string, data?: any, config?: any): Promise<any> {
    return instance.post<T>(url, data, config);
  },

  // Method for PUT requests
  async put<T = any>(url: string, data?: any, config?: any): Promise<any> {
    return instance.put<T>(url, data, config);
  },

  // Method for PATCH requests
  async patch<T = any>(url: string, data?: any, config?: any): Promise<any> {
    return instance.patch<T>(url, data, config);
  },

  // Method for DELETE requests
  async delete<T = any>(url: string, config?: any): Promise<any> {
    return instance.delete<T>(url, config);
  },
};

export const internalApi = {
  _instance: internalInstance,

  async get<T = any>(url: string, config?: any): Promise<any> {
    return internalInstance.get<T>(url, config);
  },

  async post<T = any>(url: string, data?: any, config?: any): Promise<any> {
    return internalInstance.post<T>(url, data, config);
  },

  async put<T = any>(url: string, data?: any, config?: any): Promise<any> {
    return internalInstance.put<T>(url, data, config);
  },

  async patch<T = any>(url: string, data?: any, config?: any): Promise<any> {
    return internalInstance.patch<T>(url, data, config);
  },

  async delete<T = any>(url: string, config?: any): Promise<any> {
    return internalInstance.delete<T>(url, config);
  },
};
