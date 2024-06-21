import React, { useState, useEffect, useContext } from 'react';
import InfoIcon from './assets/images/info.svg';
import './Snackbar.css';
import { ActionsContext } from './action';

interface SnackbarProps {
  duration: number;
}

const Snackbar: React.FC<SnackbarProps> = ({ duration }) => {
  const [visible, setVisible] = useState(false);
  const { setNotification, notification } = useContext(ActionsContext);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setNotification('');
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [notification, duration]);

  return (
    <div className={`snackbar ${visible ? 'show' : ''}`}>
      <img src={InfoIcon} alt="info" />
      <span>{notification}</span>
    </div>
  );
};

export default Snackbar;
