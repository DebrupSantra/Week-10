import type { AuthUser } from '../features/auth/authSlice';

export async function loginMock(email: string, password: string): Promise<AuthUser> {
  await new Promise((resolve) => window.setTimeout(resolve, 350));
  if (!email.includes('@') || password.length < 4) {
    throw new Error('Enter a valid email and a password of at least 4 characters.');
  }
  return {
    name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
    email,
    role: email.toLowerCase().startsWith('admin') ? 'Admin' : 'Member'
  };
}
