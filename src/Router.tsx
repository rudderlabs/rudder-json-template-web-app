import React, { useState } from 'react';
import { Navigate, RouterProvider, createHashRouter } from 'react-router-dom';
import { JsonTemplate } from './JsonTemplate';
import { Mappings } from './Mappings';
import { Workflow } from './Workflow';
import { ActionType, ActionsContext } from './action';

export const Router = () => {
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
  const [action, setAction] = useState<ActionType>(ActionType.None);
  const [codeName, setCodeName] = useState<string>('');
  return (
    <ActionsContext.Provider value={{ action, setAction, codeName, setCodeName }}>
      <RouterProvider router={router} />
    </ActionsContext.Provider>
  );
};
