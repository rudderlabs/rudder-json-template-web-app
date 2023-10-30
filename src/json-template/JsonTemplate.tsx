import React, { useEffect } from 'react';
import Header from '../Header';
import Playground from './Playground';

export const JsonTemplate = () => {
  useEffect(() => {
    document.title = 'Json Template Engine';
  });
  return (
    <div className="app">
      <Header />
      <Playground />
    </div>
  );
};
