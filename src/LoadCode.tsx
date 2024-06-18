import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, CodeType } from './types';
import { ActionType, ActionsContext } from './action';
import CloseIcon from './assets/images/close.svg';
import './LoadCode.css';

const LoadCode = () => {
  const { setAction } = useContext(ActionsContext);
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
  const navigate = useNavigate();
  function navigateWithCode(code: Code) {
    if (code.type === CodeType.JsonTemplate) {
      navigate('/json-template', { state: { code } });
    } else if (code.type === CodeType.Mappings) {
      navigate('/mappings', { state: { code } });
    } else {
      navigate('/workflow-engine', { state: { code } });
    }
    setAction(ActionType.None);
  }
  function handleCodeLoad(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const code = JSON.parse(e.target?.result as string) as Code;
      navigateWithCode(code);
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
