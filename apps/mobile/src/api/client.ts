import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
