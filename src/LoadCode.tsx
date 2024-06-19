import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Code, CodeType } from './types';
import { ActionType, ActionsContext, savePlaygroundSimple } from './action';
import CloseIcon from './assets/images/close.svg';
import './LoadCode.css';
import { CommonUtils } from './utils';

const LoadCode = () => {
  const { setAction } = useContext(ActionsContext);
  const navigate = useNavigate();
  const location = useLocation();

  function navigateToPage(type: CodeType) {
    closeModel();
    const navPath = CommonUtils.getNavigationPath(type);
    if (navPath === location.pathname) {
      navigate(0);
    } else {
      navigate(navPath);
    }
  }

  function closeModel() {
    setAction(ActionType.None);
  }

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModel();
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    // 👇️ clean up event listener
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  function handleCodeLoad(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const code = JSON.parse(e.target?.result as string) as Code;
      savePlaygroundSimple(code);
      navigateToPage(code.type);
    };
    reader.readAsText(file);
  }
  return (
    <div className="load-code" onClick={closeModel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <img src={CloseIcon} alt="Close" className="close" onClick={closeModel} />
        <div className="title">Load Code</div>
        <input type="file" onChange={handleCodeLoad} />
      </div>
    </div>
  );
};

export default LoadCode;
