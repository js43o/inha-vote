import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import '~/styles/index.css';
import { CurrentVotePage } from '~/pages/CurrentVote';

const router = createBrowserRouter([
    {
        path: 'vote',
        children: [{ path: 'current', element: <CurrentVotePage /> }],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
