import { createBrowserRouter, Navigate } from 'react-router-dom';
import DocContent from './features/doc-content/DocContent';
import Musicians from './pages/Musicians';
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
          path: '/musicians',
          element: <Musicians />,
        },
        {
          path: '/about',
          element: <About />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
