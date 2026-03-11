import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import DocContent from './features/doc-content/DocContent';
import SideNav from './features/side-nav/SideNav';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <main id="main">
          <SideNav />
          <Outlet />
        </main>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/docs" />,
        },
        {
          path: '/docs/:ostSeries?',
          element: <DocContent />,
        },
        // {
        //   path: '/musicians',
        // },
        // {
        //   path: '/about',
        // },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
