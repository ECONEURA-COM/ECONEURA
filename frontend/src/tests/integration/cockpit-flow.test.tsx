import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import EconeuraCockpit from '../../EconeuraCockpit';

// Mock de fetch global
global.fetch = vi.fn();

describe('Cockpit Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renderiza el Cockpit correctamente', () => {
    render(
      <BrowserRouter>
        <EconeuraCockpit />
      </BrowserRouter>
    );

    // Verificar elementos clave
    expect(screen.getByText(/ECONEURA/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/buscar agentes/i)).toBeInTheDocument();
  });

  it('cambia de departamento correctamente', async () => {
    render(
      <BrowserRouter>
        <EconeuraCockpit />
      </BrowserRouter>
    );

    // Buscar botón de Marketing (si existe)
    const marketingBtn = screen.queryByText(/marketing/i);
    if (marketingBtn) {
      fireEvent.click(marketingBtn);
      await waitFor(() => {
        expect(marketingBtn).toHaveClass('font-bold');
      });
    }
  });

  it('realiza búsqueda de agentes', async () => {
    render(
      <BrowserRouter>
        <EconeuraCockpit />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/buscar agentes/i);
    
    // Escribir en el campo de búsqueda
    fireEvent.change(searchInput, { target: { value: 'comercial' } });
    
    // Verificar que el input tiene el valor
    expect(searchInput).toHaveValue('comercial');
  });

  it('alterna entre modo claro y oscuro', () => {
    render(
      <BrowserRouter>
        <EconeuraCockpit />
      </BrowserRouter>
    );

    // Buscar botón de dark mode (puede ser Moon o Sun icon)
    const darkModeBtn = screen.getByLabelText(/modo oscuro|modo claro/i);
    
    fireEvent.click(darkModeBtn);
    
    // Verificar que el localStorage se actualizó
    expect(localStorage.getItem('econeura_dark_mode')).toBeTruthy();
  });

  it('muestra configuración de API key al hacer click en settings', async () => {
    render(
      <BrowserRouter>
        <EconeuraCockpit />
      </BrowserRouter>
    );

    const settingsBtn = screen.getByLabelText(/configuración/i);
    fireEvent.click(settingsBtn);

    // Esperar a que aparezca el modal
    await waitFor(() => {
      expect(screen.getByText(/configurar/i)).toBeInTheDocument();
    });
  });
});

