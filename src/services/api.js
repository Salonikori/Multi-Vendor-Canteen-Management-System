// ─────────────────────────────────────────────────────────────────────────
// API SERVICE LAYER
//
// This file simulates a REST API using in-memory data + artificial network
// delay, so the rest of the app can be written exactly as it would be
// against a real backend.
//
// To connect a real backend: replace the body of each function with a
// fetch/axios call to the matching endpoint (shown in comments above each
// function) and remove the in-memory store below.
// ─────────────────────────────────────────────────────────────────────────

import { VENDORS, MENU_ITEMS, SEED_ORDERS, orderTotal } from '../data/mockData'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.campuseats.example/v1'

const delay = (ms = 450) => new Promise((res) => setTimeout(res, ms))

// In-memory "database" (deep-cloned so seed data stays pristine on reload)
let _vendors = JSON.parse(JSON.stringify(VENDORS))
let _orders = JSON.parse(JSON.stringify(SEED_ORDERS))
let _orderCounter = 2852

// ── Background simulation ──────────────────────────────────────────────
// Mimics kitchens progressing orders so dashboards feel "live" even
// without user interaction. A real deployment would receive these
// updates via WebSocket / polling against the backend instead.
const STATUS_PROGRESSION = { pending: 'preparing', preparing: 'ready', ready: 'delivered' }

let _listeners = []
const notify = () => _listeners.forEach((cb) => cb())

export function subscribeToOrderUpdates(callback) {
  _listeners.push(callback)
  return () => {
    _listeners = _listeners.filter((cb) => cb !== callback)
  }
}

if (typeof window !== 'undefined' && !window.__campuseats_sim_started) {
  window.__campuseats_sim_started = true
  setInterval(() => {
    let changed = false
    _orders.forEach((o) => {
      const next = STATUS_PROGRESSION[o.status]
      if (next && Math.random() < 0.18) {
        o.status = next
        changed = true
      }
    })
    if (changed) notify()
  }, 6000)
}

// ── Auth / Role-based access ───────────────────────────────────────────
// POST /auth/login
export async function login({ role, vendorId, name }) {
  await delay(400)
  if (role === 'vendor') {
    const vendor = _vendors.find((v) => v.id === Number(vendorId))
    if (!vendor) throw new Error('Vendor not found')
    return {
      id: `vendor-${vendor.id}`,
      role: 'vendor',
      name: vendor.name,
      vendorId: vendor.id,
      token: `mock-jwt-vendor-${vendor.id}`,
    }
  }
  if (role === 'admin') {
    return { id: 'admin-1', role: 'admin', name: 'System Admin', token: 'mock-jwt-admin' }
  }
  return {
    id: 'stu-1',
    role: 'student',
    name: name?.trim() || 'Student',
    token: 'mock-jwt-student',
  }
}

// ── Vendors ─────────────────────────────────────────────────────────────
// GET /vendors
export async function getVendors() {
  await delay()
  return JSON.parse(JSON.stringify(_vendors))
}

// GET /vendors/:id
export async function getVendor(id) {
  await delay(250)
  const vendor = _vendors.find((v) => v.id === Number(id))
  if (!vendor) throw new Error('Vendor not found')
  return { ...vendor }
}

// PATCH /vendors/:id  { open: boolean }
export async function setVendorOpen(id, open) {
  await delay(300)
  const vendor = _vendors.find((v) => v.id === Number(id))
  if (!vendor) throw new Error('Vendor not found')
  vendor.open = open
  return { ...vendor }
}

// ── Menu ────────────────────────────────────────────────────────────────
// GET /vendors/:id/menu
export async function getMenu(vendorId) {
  await delay()
  return JSON.parse(JSON.stringify(MENU_ITEMS[Number(vendorId)] || []))
}

// ── Orders ──────────────────────────────────────────────────────────────
// GET /orders  (admin - all orders)
export async function getAllOrders() {
  await delay()
  return JSON.parse(JSON.stringify(_orders)).sort((a, b) => b.createdAt - a.createdAt)
}

// GET /vendors/:id/orders
export async function getOrdersByVendor(vendorId) {
  await delay()
  return JSON.parse(JSON.stringify(_orders))
    .filter((o) => o.vendorId === Number(vendorId))
    .sort((a, b) => b.createdAt - a.createdAt)
}

// GET /students/:id/orders
export async function getOrdersByStudent(studentId) {
  await delay()
  return JSON.parse(JSON.stringify(_orders))
    .filter((o) => o.studentId === studentId)
    .sort((a, b) => b.createdAt - a.createdAt)
}

// POST /orders  { studentId, studentName, items: [{vendorId, name, price, qty}], table }
export async function createOrder({ studentId, studentName, items, table = 'T-01' }) {
  await delay(500)
  if (!items || items.length === 0) throw new Error('Cart is empty')

  // Group cart items by vendor — a real canteen splits a multi-vendor cart
  // into one order per vendor so each kitchen only sees its own items.
  const byVendor = items.reduce((acc, item) => {
    acc[item.vendorId] = acc[item.vendorId] || []
    acc[item.vendorId].push({ name: item.name, price: item.price, qty: item.qty })
    return acc
  }, {})

  const created = []
  for (const [vendorId, vendorItems] of Object.entries(byVendor)) {
    const order = {
      id: `ORD-${_orderCounter++}`,
      vendorId: Number(vendorId),
      studentId,
      studentName,
      table,
      items: vendorItems,
      status: 'pending',
      createdAt: Date.now(),
    }
    _orders.unshift(order)
    created.push(order)
  }
  notify()
  return JSON.parse(JSON.stringify(created))
}

// PATCH /orders/:id/status  { status }
export async function updateOrderStatus(orderId, status) {
  await delay(350)
  const order = _orders.find((o) => o.id === orderId)
  if (!order) throw new Error('Order not found')
  order.status = status
  notify()
  return { ...order }
}

export { orderTotal, BASE_URL }
