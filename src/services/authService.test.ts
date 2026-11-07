import { loginMock } from './authService';

describe('loginMock', () => {
  it('returns a standard member for a valid email and password', async () => {
    await expect(loginMock('olivia.rhye@example.com', 'pass1234')).resolves.toMatchObject({
      name: 'Olivia Rhye', role: 'Member'
    });
  });

  it('grants the demo admin role only to the admin-prefixed address', async () => {
    await expect(loginMock('admin@acme.co', 'pass1234')).resolves.toMatchObject({ role: 'Admin' });
  });

  it('rejects invalid credentials with a clear message', async () => {
    await expect(loginMock('not-an-email', 'x')).rejects.toThrow('Enter a valid email');
  });
});
