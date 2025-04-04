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
  AuthCheck,
  NoPage,
} from '~/pages';
import { Layout } from './components/Layout';

const router = createBrowserRouter([
  {
    path: 'votes',
    element: <Layout />,
    children: [
      { path: 'planned', element: <PlannedVotePage /> },
      { path: 'current', element: <CurrentVotePage /> },
      { path: 'closed', element: <ClosedVotePage /> },
    ],
  },
  {
    path: 'vote',
    element: <Layout padding={false} />,
    children: [{ path: ':id', element: <VoteDetailPage /> }],
  },
  { path: 'register', element: <RegisterPage /> },
  { path: 'login', element: <LoginPage /> },
  { path: '/', element: <AuthCheck /> },
  { path: '*', element: <NoPage /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
