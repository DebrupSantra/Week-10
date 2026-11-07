import reducer, { signedIn, signedOut } from './authSlice';

describe('authSlice', () => {
  it('stores the signed-in user and clears the session on sign out', () => {
    const user = { name: 'Olivia Rhye', email: 'olivia@acme.co', role: 'Admin' as const };
    const authenticated = reducer(undefined, signedIn(user));
    expect(authenticated.user).toEqual(user);
    expect(reducer(authenticated, signedOut()).user).toBeNull();
  });
});
