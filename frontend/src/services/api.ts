import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  amenities: string;
  is_active: boolean;
}

export interface Booking {
  id: number;
  room_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  purpose: string;
  created_at: string;
  updated_at: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    formData.append('grant_type', 'password');
    
    const response = await api.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  register: async (credentials: RegisterCredentials) => {
    const response = await api.post('/users', credentials);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

export const roomService = {
  getRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },
  getRoom: async (id: number) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },
  createRoom: async (room: Omit<Room, 'id' | 'is_active'>) => {
    const response = await api.post('/rooms', room);
    return response.data;
  },
  updateRoom: async (id: number, room: Omit<Room, 'id' | 'is_active'>) => {
    const response = await api.put(`/rooms/${id}`, room);
    return response.data;
  },
  deleteRoom: async (id: number) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },
};

export const bookingService = {
  getBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
  getBooking: async (id: number) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  createBooking: async (booking: Omit<Booking, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },
  deleteBooking: async (id: number) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

export default api; 