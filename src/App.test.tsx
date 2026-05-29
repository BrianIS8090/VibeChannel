import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('VibeChannel pocket radio', () => {
  it('renders the selected Pixel Pocket Radio direction without TUI clutter', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'VibeChannel' })).toBeInTheDocument();
    expect(screen.getByText('PIXEL POCKET')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Пиксельное радио' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Groove Salad/i })).toBeInTheDocument();
    expect(screen.getByText('lofi / soft beats / night mode')).toBeInTheDocument();

    expect(screen.queryByText(/terminal/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/command/i)).not.toBeInTheDocument();
  });

  it('shows three starter stations and changes the current station when a station is chosen', async () => {
    const user = userEvent.setup();
    render(<App />);

    const stations = screen.getByRole('list', { name: 'Станции' });
    expect(within(stations).getAllByRole('listitem')).toHaveLength(3);

    await user.click(screen.getByRole('button', { name: /Rain Bits/i }));

    expect(screen.getByRole('heading', { name: /Rain Bits/i })).toBeInTheDocument();
    expect(screen.getByText('rain tape / tiny room / calm')).toBeInTheDocument();
  });

  it('keeps the mobile-first bottom navigation small and focused', () => {
    render(<App />);

    const navigation = screen.getByRole('navigation', { name: 'Основная навигация' });
    expect(within(navigation).getAllByRole('button')).toHaveLength(4);
    expect(within(navigation).getByRole('button', { name: 'эфир' })).toHaveAttribute('aria-current', 'page');
  });
});
