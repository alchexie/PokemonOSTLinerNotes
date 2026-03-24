import { createBrowserRouter, Navigate } from 'react-router-dom';
import DocContent from './features/doc-content/DocContent';
import Composer from './pages/Composer';
import About from './pages/About';
import RootLayout from './RootLayout';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/docs" />,
        },
        {
          path: '/docs/:ostSeries?',
          element: <DocContent />,
        },
        {
          path: '/composer',
          element: <Composer />,
        },
        {
          path: '/about',
          element: <About />,
        },
        {
          path: '*',
          element: <Navigate to="/about" replace />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
