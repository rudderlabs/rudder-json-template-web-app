import React, { useEffect } from 'react';
import Header from '../Header';
import Playground from './Playground';

export const Workflow = () => {
  useEffect(() => {
    document.title = 'Workflow Engine';
  });
  return (
    <div className="app">
      <Header />
      <Playground />
    </div>
  );
};
