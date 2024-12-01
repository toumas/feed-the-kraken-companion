import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JoinGame from '@/components/JoinGame';
import { joinGame } from '@/app/utils/gameUtils';

// Add console.error mock
const originalConsoleError = console.error;

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/app/utils/gameUtils', () => ({
  joinGame: jest.fn(),
}));

describe('JoinGame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Silence console.error for tests
    console.error = jest.fn();
  });

  afterAll(() => {
    // Restore console.error
    console.error = originalConsoleError;
  });

  it('renders the join game form', () => {
    render(<JoinGame />);
    expect(screen.getByRole('heading', { name: 'Join Game' })).toBeInTheDocument();
    expect(screen.getByLabelText('Game PIN')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Join Game' })).toBeInTheDocument();
  });

  it('displays error when form is submitted without input', async () => {
    render(<JoinGame />);
    const joinButton = screen.getByRole('button', { name: 'Join Game' });
    fireEvent.click(joinButton);
    expect(await screen.findByText('Please enter a game PIN')).toBeInTheDocument();
  });

  it('validates form inputs correctly', async () => {
    render(<JoinGame />);
    const joinButton = screen.getByRole('button', { name: 'Join Game' });
    
    // Test empty fields
    fireEvent.click(joinButton);
    expect(await screen.findByText('Please enter a game PIN')).toBeInTheDocument();
    expect(screen.getByText('Please enter your name')).toBeInTheDocument();

    // Test filling only one field
    const pinInput = screen.getByLabelText('Game PIN');
    fireEvent.change(pinInput, { target: { value: '1234' } });
    fireEvent.click(joinButton);
    expect(screen.queryByText('Please enter a game PIN')).not.toBeInTheDocument();
    expect(screen.getByText('Please enter your name')).toBeInTheDocument();
  });

  it('successfully joins a game', async () => {
    const mockGameId = 'game-123';
    (joinGame as jest.Mock).mockResolvedValueOnce(mockGameId);
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockImplementation(() => ({
      push: mockPush,
    }));

    render(<JoinGame />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Game PIN'), { target: { value: '1234' } });
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Player 1' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Join Game' }));

    await waitFor(() => {
      expect(joinGame).toHaveBeenCalledWith('1234', 'Player 1');
      expect(mockPush).toHaveBeenCalledWith(`/game/${mockGameId}`);
    });
  });

  it('handles game not found error', async () => {
    (joinGame as jest.Mock).mockRejectedValueOnce(new Error('Game not found'));

    render(<JoinGame />);
    
    fireEvent.change(screen.getByLabelText('Game PIN'), { target: { value: '1234' } });
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Player 1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Join Game' }));

    expect(await screen.findByText('Invalid game PIN. Please check and try again.')).toBeInTheDocument();
  });

  it('handles generic errors', async () => {
    (joinGame as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<JoinGame />);
    
    fireEvent.change(screen.getByLabelText('Game PIN'), { target: { value: '1234' } });
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Player 1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Join Game' }));

    expect(await screen.findByText('Network error')).toBeInTheDocument();
  });
});