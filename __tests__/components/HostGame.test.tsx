import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HostGame from '@/components/HostGame';
import { useRouter } from 'next/navigation';

const mockPush = jest.fn();

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
    forward: jest.fn(),
    push: mockPush,
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}));

// Mock fetch globally
global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({})
}));

// Wrapper component for tests
const renderWithRouter = (component: React.ReactElement) => {
  return render(component);
};

describe('HostGame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the HostGame component', () => {
    renderWithRouter(<HostGame />);
    expect(screen.getByText('Host a Game')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByText('Create and Join New Game')).toBeInTheDocument();
  });

  it('shows an error message when the name is not provided', async () => {
    renderWithRouter(<HostGame />);
    fireEvent.click(screen.getByText('Create and Join New Game'));
    await waitFor(() => {
      expect(screen.getByText('Please enter your name')).toBeInTheDocument();
    });
  });

  it('creates a game and navigates to the game page on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ workflowId: 'test-workflow-id' }),
    });

    renderWithRouter(<HostGame />);
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Test Host' } });
    fireEvent.click(screen.getByText('Create and Join New Game'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/host-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hostName: 'Test Host' }),
      });
      expect(mockPush).toHaveBeenCalledWith('/game/test-workflow-id');
    });
  });

  it('shows an error message when the API call fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Failed to host game' }),
    });

    renderWithRouter(<HostGame />);
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Test Host' } });
    fireEvent.click(screen.getByText('Create and Join New Game'));

    await waitFor(() => {
      expect(screen.getByText('Failed to host game')).toBeInTheDocument();
    });
  });
});