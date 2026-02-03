import { createBrowserRouter, Navigate } from 'react-router-dom';
import ContentLayout from './features/content/ContentLayout';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/docs" />,
    },
    {
      path: '/docs/:groupKey?',
      element: <ContentLayout />,
    },
  ],
  {
    basename: '/ost',
  }
);
