import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { testimonials } from '../lib/testimonials';

function getActiveSlideText(container: HTMLElement): string {
  const active = container.querySelector('[aria-hidden="false"]');
  if (!active) throw new Error('no active slide found');
  return active.textContent ?? '';
}

describe('TestimonialCarousel', () => {
  afterEach(() => {
    testimonials.length = 0;
    vi.unstubAllEnvs();
  });

  it('always renders the milestone slide first', () => {
    testimonials.push(
      { id: 't1', quote: 'Great!', name: 'Alice' },
      { id: 't2', quote: 'Lovely!', name: 'Bob' }
    );
    const { container } = render(<TestimonialCarousel />);
    expect(getActiveSlideText(container)).toContain('1,000+');
  });

  it('moves to the next/previous slide and loops at both ends', () => {
    testimonials.push(
      { id: 't1', quote: 'Great!', name: 'Alice' },
      { id: 't2', quote: 'Lovely!', name: 'Bob' }
    );
    const { container } = render(<TestimonialCarousel />);

    const next = screen.getByRole('button', { name: 'Next testimonial' });
    const prev = screen.getByRole('button', { name: 'Previous testimonial' });

    expect(getActiveSlideText(container)).toContain('1,000+');

    fireEvent.click(next);
    expect(getActiveSlideText(container)).toContain('Alice');

    fireEvent.click(next);
    expect(getActiveSlideText(container)).toContain('Bob');

    // Looping forward past the last slide should wrap to the milestone.
    fireEvent.click(next);
    expect(getActiveSlideText(container)).toContain('1,000+');

    // Looping backward past the first slide should wrap to the last testimonial.
    fireEvent.click(prev);
    expect(getActiveSlideText(container)).toContain('Bob');
  });

  it('responds to ArrowLeft/ArrowRight keys', () => {
    testimonials.push(
      { id: 't1', quote: 'Great!', name: 'Alice' },
      { id: 't2', quote: 'Lovely!', name: 'Bob' }
    );
    const { container } = render(<TestimonialCarousel />);
    const region = screen.getByRole('region', { name: 'Customer testimonials' });

    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(getActiveSlideText(container)).toContain('Alice');

    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    expect(getActiveSlideText(container)).toContain('1,000+');
  });

  it('shows only the milestone and hides arrows/dots when testimonials is empty in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { container } = render(<TestimonialCarousel />);

    expect(getActiveSlideText(container)).toContain('1,000+');
    expect(screen.queryByRole('button', { name: 'Next testimonial' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Previous testimonial' })).toBeNull();
    expect(screen.queryByRole('button', { name: /Go to slide/ })).toBeNull();
  });
});
