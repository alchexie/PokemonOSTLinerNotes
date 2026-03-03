import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './features/main/MainLayout';
import ContentLayout from './features/content/ContentLayout';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/docs" />,
        },
        {
          path: '/docs/:groupKey?',
          element: <ContentLayout />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
