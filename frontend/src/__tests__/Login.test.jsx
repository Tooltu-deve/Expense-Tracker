import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login page', () => {
  it('renders Expense Tracker and Sign In', () => {
    renderLogin();
    expect(screen.getByText('Expense Tracker')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('renders Sign In and Register link', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
});
