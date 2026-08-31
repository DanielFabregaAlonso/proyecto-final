import { get, post, put, del } from './client';

export function listSneakers(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
  ).toString();
  return get(`/sneakers${query ? `?${query}` : ''}`);
}

export function getSneaker(id) {
  return get(`/sneakers/${id}`);
}

export function createSneaker(formData) {
  return post('/sneakers', formData);
}

export function updateSneaker(id, formData) {
  return put(`/sneakers/${id}`, formData);
}

export function deleteSneaker(id) {
  return del(`/sneakers/${id}`);
}
