import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JoinGame from '@/components/JoinGame';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('JoinGame', () => {
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

  // Add more tests as needed
});