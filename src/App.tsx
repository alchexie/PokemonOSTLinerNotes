import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeTrigger } from './features/theme/ThemeTrigger';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ThemeTrigger />
    </>
  );
}
