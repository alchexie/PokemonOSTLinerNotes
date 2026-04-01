import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import DocContent from './features/doc-content/DocContent';
import RootLayout from './RootLayout';
import Loading from './features/loading/loading';

const Composer = lazy(() => import('./pages/Composer'));
const About = lazy(() => import('./pages/About'));

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
          element: (
            <Suspense fallback={<Loading></Loading>}>
              <Composer />
            </Suspense>
          ),
        },
        {
          path: '/about',
          element: (
            <Suspense fallback={<Loading></Loading>}>
              <About />
            </Suspense>
          ),
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
