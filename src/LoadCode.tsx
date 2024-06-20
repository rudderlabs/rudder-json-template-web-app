import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code } from './types';
import { ActionType, ActionsContext, savePlayground } from './action';
import CloseIcon from './assets/images/close.svg';
import './LoadCode.css';
import { CommonUtils } from './utils';

const LoadCode = () => {
  const { setAction } = useContext(ActionsContext);
  const navigate = useNavigate();

  function navigateToPage(code: Code) {
    closeModel();
    navigate(CommonUtils.getNavigationPath(code.type), { state: { code } });
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
      savePlayground(code);
      navigateToPage(code);
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
