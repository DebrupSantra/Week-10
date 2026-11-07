import type { AppUser, Transaction } from '../types';

export const initialUsers: AppUser[] = [
  { id: 'u-1', name: 'Olivia Rhye', email: 'olivia@acme.co', role: 'Admin', status: 'Active', joined: '2024-08-12' },
  { id: 'u-2', name: 'Phoenix Baker', email: 'phoenix@acme.co', role: 'Analyst', status: 'Active', joined: '2024-09-03' },
  { id: 'u-3', name: 'Lana Steiner', email: 'lana@acme.co', role: 'Member', status: 'Active', joined: '2024-09-18' },
  { id: 'u-4', name: 'Demi Wilkinson', email: 'demi@acme.co', role: 'Analyst', status: 'Invited', joined: '2024-10-02' },
  { id: 'u-5', name: 'Candice Wu', email: 'candice@acme.co', role: 'Member', status: 'Active', joined: '2024-10-21' },
  { id: 'u-6', name: 'Natali Craig', email: 'natali@acme.co', role: 'Member', status: 'Suspended', joined: '2024-11-01' },
  { id: 'u-7', name: 'Drew Cano', email: 'drew@acme.co', role: 'Analyst', status: 'Active', joined: '2024-11-10' }
];

export const transactions: Transaction[] = [
  { id: 'ORD-2401', customer: 'Olivia Rhye', email: 'olivia@acme.co', date: 'Nov 24, 2024', amount: 2480, status: 'Paid' },
  { id: 'ORD-2400', customer: 'Phoenix Baker', email: 'phoenix@acme.co', date: 'Nov 23, 2024', amount: 1290, status: 'Pending' },
  { id: 'ORD-2399', customer: 'Lana Steiner', email: 'lana@acme.co', date: 'Nov 22, 2024', amount: 860, status: 'Paid' },
  { id: 'ORD-2398', customer: 'Demi Wilkinson', email: 'demi@acme.co', date: 'Nov 21, 2024', amount: 3450, status: 'Paid' },
  { id: 'ORD-2397', customer: 'Candice Wu', email: 'candice@acme.co', date: 'Nov 20, 2024', amount: 520, status: 'Refunded' }
];

export const revenueData = [
  { month: 'Jan', current: 38, previous: 30 }, { month: 'Feb', current: 46, previous: 35 },
  { month: 'Mar', current: 42, previous: 39 }, { month: 'Apr', current: 58, previous: 43 },
  { month: 'May', current: 53, previous: 46 }, { month: 'Jun', current: 68, previous: 51 },
  { month: 'Jul', current: 61, previous: 48 }, { month: 'Aug', current: 74, previous: 57 },
  { month: 'Sep', current: 66, previous: 53 }, { month: 'Oct', current: 82, previous: 62 },
  { month: 'Nov', current: 78, previous: 60 }, { month: 'Dec', current: 94, previous: 69 }
];

export const activityData = [
  { day: 'Mon', newUsers: 32, returning: 24 }, { day: 'Tue', newUsers: 42, returning: 31 },
  { day: 'Wed', newUsers: 35, returning: 28 }, { day: 'Thu', newUsers: 54, returning: 36 },
  { day: 'Fri', newUsers: 48, returning: 33 }, { day: 'Sat', newUsers: 62, returning: 43 },
  { day: 'Sun', newUsers: 57, returning: 40 }
];

export const salesData = [
  { name: 'Subscriptions', value: 48, color: '#6558f5' },
  { name: 'One-time', value: 29, color: '#34b3a0' },
  { name: 'Add-ons', value: 23, color: '#f2a94a' }
];

export const productData = [
  { name: 'Workspace Pro', category: 'Subscription', sales: 1240, revenue: '$62,000', change: '+12.8%' },
  { name: 'Analytics Plus', category: 'Add-on', sales: 892, revenue: '$44,600', change: '+8.4%' },
  { name: 'Team seats', category: 'Subscription', sales: 754, revenue: '$30,160', change: '+6.1%' }
];
