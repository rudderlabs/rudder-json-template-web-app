import { createContext } from 'react';
import { Code, CodeType } from './types';

export enum ActionType {
  Saving,
  Save,
  Load,
  None,
}

export type Action = {
  action: ActionType;
  codeName: string;
  setAction: (action: ActionType) => void;
  setCodeName: (codeName: string) => void;
};

export const ActionsContext = createContext<Action>({
  action: ActionType.None,
  setAction: () => {},
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
