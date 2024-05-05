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
  LoginPage,
  TestPage,
  NoPage,
} from '~/pages';

const router = createBrowserRouter([
  {
    path: 'votes',
    children: [
      { path: 'planned', element: <PlannedVotePage /> },
      { path: 'current', element: <CurrentVotePage /> },
      { path: 'closed', element: <ClosedVotePage /> },
    ],
  },
  { path: 'vote/:id', element: <VoteDetailPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: 'login', element: <LoginPage /> },
  { path: '/', element: <TestPage /> },
  { path: '*', element: <NoPage /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
