import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom';
import { JsonTemplate } from './JsonTemplate';
import { Mappings } from './Mappings';
import { Workflow } from './Workflow';
import './index.css';

const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/json-template" />,
  },
  {
    path: '/json-template',
    element: <JsonTemplate />,
  },
  {
    path: '/mappings',
    element: <Mappings />,
  },
  {
    path: '/workflow-engine',
    element: <Workflow />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
