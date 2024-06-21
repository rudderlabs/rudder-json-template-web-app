import { createContext } from 'react';
import { Code, CodeType } from './types';

export enum ActionType {
  Copy,
  Saving,
  Save,
  Load,
  None,
}

export type Action = {
  action: ActionType;
  codeName: string;
  notification: string;
  codePasted?: Code;
  setCodePasted: (code: Code) => void;
  setNotification: (notification: string) => void;
  setAction: (action: ActionType) => void;
  setCodeName: (codeName: string) => void;
};

export const ActionsContext = createContext<Action>({
  codePasted: undefined,
  setCodePasted: () => {},
  action: ActionType.None,
  setAction: () => {},
  notification: '',
  setNotification: () => {},
  setCodeName: () => {},
  codeName: '',
});

let timeout: NodeJS.Timeout;

function savePlaygroundSimple(code: Code) {
  localStorage.setItem(`playgrounds-${code.type}`, JSON.stringify(code));
}

export function savePlayground(code: Code) {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    savePlaygroundSimple(code);
  }, 100);
}

export function getPlayground(type: CodeType): Code {
  return JSON.parse(localStorage.getItem(`playgrounds-${type}`) ?? '{}');
}
