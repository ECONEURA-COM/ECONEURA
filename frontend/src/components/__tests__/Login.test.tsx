import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Login } from '../Login';

describe('Login', () => {
  const mockOnLoginSuccess = vi.fn();

  it('renders login form', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    expect(screen.getByText('ECONEURA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('shows OAuth buttons', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    expect(screen.getByText('Continuar con Google')).toBeInTheDocument();
    expect(screen.getByText('Continuar con Microsoft')).toBeInTheDocument();
    expect(screen.getByText('Continuar con GitHub')).toBeInTheDocument();
  });

  it('toggles between login and register', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const toggleButton = screen.getByText('¿No tienes cuenta? Regístrate');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Crea tu cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Juan Pérez')).toBeInTheDocument();
  });

  it('shows register form fields', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const toggleButton = screen.getByText('¿No tienes cuenta? Regístrate');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Nombre completo')).toBeInTheDocument();
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
  });

  it('handles Google OAuth click', () => {
    delete (window as any).location;
    (window as any).location = { href: '', hostname: 'localhost' };

    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const googleButton = screen.getByText('Continuar con Google');
    fireEvent.click(googleButton);

    expect(window.location.href).toContain('/api/oauth/google');
  });
});

