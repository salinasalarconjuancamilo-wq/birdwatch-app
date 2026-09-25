import { render, screen } from '@testing-library/react';
import App from './App';

test('muestra la pantalla de bienvenida', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Bienvenido a BIRDWATCH' })).toBeInTheDocument();
});
