import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import HostGame from '@/components/HostGame';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the fetch function
global.fetch = jest.fn();

describe('HostGame', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (global.fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the component', () => {
    render(<HostGame />);
    expect(screen.getByText('Host a Game')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByText('Create and Join New Game')).toBeInTheDocument();
  });

  it('shows an error when trying to host without a name', async () => {
    render(<HostGame />);
    fireEvent.click(screen.getByText('Create and Join New Game'));
    await waitFor(() => {
      expect(screen.getByText('Please enter your name')).toBeInTheDocument();
    });
  });

  it('creates a game and navigates to the game page on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ gameSession: { id: 'test-game-id' }, playerId: 'test-player-id' }),
    });

    render(<HostGame />);
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Test Host' } });
    fireEvent.click(screen.getByText('Create and Join New Game'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/gameSession/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hostName: 'Test Host' }),
      });
      expect(mockPush).toHaveBeenCalledWith('/game/test-game-id?playerId=test-player-id');
    });
  });

  it('shows an error message when the API call fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<HostGame />);
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Test Host' } });
    fireEvent.click(screen.getByText('Create and Join New Game'));

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });
});