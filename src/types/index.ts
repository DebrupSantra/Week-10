export type UserRole = 'Admin' | 'Analyst' | 'Member';
export type UserStatus = 'Active' | 'Invited' | 'Suspended';
export type OrderStatus = 'Paid' | 'Pending' | 'Refunded';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
}

export interface Transaction {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  status: OrderStatus;
}

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
}
