import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '../App';
import { store } from './store';

describe('protected application routes', () => {
  it('redirects an unauthenticated visitor to sign in', async () => {
    render(<Provider store={store}><App /></Provider>);
    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });
});
