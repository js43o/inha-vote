import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import '~/styles/index.css';
import {
  PlannedVotePage,
  CurrentVotePage,
  ClosedVotePage,
  VoteDetailPage,
  RegisterPage,
} from '~/pages';

const router = createBrowserRouter([
  {
    path: 'vote',
    children: [
      { path: 'planned', element: <PlannedVotePage /> },
      { path: 'current', element: <CurrentVotePage /> },
      { path: 'closed', element: <ClosedVotePage /> },
      { path: ':id', element: <VoteDetailPage /> },
    ],
  },
  { path: 'register', element: <RegisterPage /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
