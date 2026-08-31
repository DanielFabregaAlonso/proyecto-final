import { get, post } from './client';

export function register({ name, email, password }) {
  return post('/auth/register', { name, email, password });
}

export function login({ email, password }) {
  return post('/auth/login', { email, password });
}

export function getMe() {
  return get('/auth/me');
}
