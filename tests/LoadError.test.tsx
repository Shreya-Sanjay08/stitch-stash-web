import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoadError from '../components/LoadError';
import { INSTAGRAM_DM_URL } from '../lib/inquiry';

describe('LoadError', () => {
  it('renders the friendly message', () => {
    render(<LoadError onRetry={() => {}} />);
    expect(
      screen.getByText(
        "We couldn't load our creations just now. Please try again, or message us on Instagram."
      )
    ).toBeInTheDocument();
  });

  it('calls onRetry when "Try again" is clicked', async () => {
    const onRetry = vi.fn();
    render(<LoadError onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('links to the Instagram DM URL', () => {
    render(<LoadError onRetry={() => {}} />);
    expect(screen.getByRole('link', { name: 'Message on Instagram' })).toHaveAttribute(
      'href',
      INSTAGRAM_DM_URL
    );
  });
});
