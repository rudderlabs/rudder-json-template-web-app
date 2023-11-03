import React, { useContext, useEffect, useState } from 'react';
import { ActionType, ActionsContext } from './action';
import CloseIcon from './assets/images/close.svg';
import './SaveCode.css';

const SaveCode = () => {
  const { setAction, setCodeName } = useContext(ActionsContext);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCodeName(event.target.value);
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
      if (event.key === 'Enter') {
        event.preventDefault();
        handleCodeSave();
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    // 👇️ clean up event listener
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  function handleCodeSave() {
    setAction(ActionType.Save);
  }

  return (
    <div className="save-code" onClick={closeModel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <img src={CloseIcon} alt="Close" className="close" onClick={closeModel} />
        <div className="title">Save Code</div>
        <input type="text" placeholder='Enter Code name' onChange={handleChange}/>
        <button onClick={handleCodeSave}>Save</button>
      </div>
    </div>
  );
};

export default SaveCode;
