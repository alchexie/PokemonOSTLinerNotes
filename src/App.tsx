import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeTrigger } from './features/theme-trigger/ThemeTrigger';

export const TITLE: string = 'Pokémon OST Liner Notes';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ThemeTrigger />
    </>
  );
}
