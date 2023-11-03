import { createContext } from 'react';

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
