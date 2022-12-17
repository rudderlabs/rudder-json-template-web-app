import React, { useEffect } from 'react';
import Header from './Header';
import Playground from './Playground';

const App = () => {
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
export default App;
