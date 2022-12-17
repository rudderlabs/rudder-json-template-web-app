import React from 'react';
import LoadingGif from './assets/images/loader.gif';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader">
      <img src={LoadingGif} alt="Executing..." />
    </div>
  );
};

export default Loader;
