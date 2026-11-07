import reducer, { addUser, removeUser, updateUser } from './userSlice';
import type { AppUser } from '../../types';

describe('userSlice', () => {
  const user: AppUser = { id: 'test-1', name: 'Test User', email: 'test@example.com', role: 'Member', status: 'Active', joined: '2024-01-01' };

  it('adds, updates, and removes users', () => {
    const withUser = reducer(undefined, addUser(user));
    expect(withUser.items[0]).toEqual(user);
    const updated = reducer(withUser, updateUser({ ...user, role: 'Analyst' }));
    expect(updated.items.find((item) => item.id === user.id)?.role).toBe('Analyst');
    expect(reducer(updated, removeUser(user.id)).items.some((item) => item.id === user.id)).toBe(false);
  });

  it('does not add an unknown user during update', () => {
    const current = reducer(undefined, updateUser(user));
    expect(current.items).toHaveLength(7);
    expect(current.items.some((item) => item.id === user.id)).toBe(false);
  });
});
