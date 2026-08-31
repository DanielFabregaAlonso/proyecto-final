import { get, post, patch } from './client';

export function createOrder(payload) {
  return post('/orders', payload);
}

export function getMyOrders() {
  return get('/orders/mine');
}

export function getAllOrders() {
  return get('/orders');
}

export function updateOrderStatus(id, status) {
  return patch(`/orders/${id}/status`, { status });
}
