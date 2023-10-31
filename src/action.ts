import { createContext } from "react";

export enum ActionType {
    Save,
    Load,
    None,
}

export type Action = {
    action: ActionType;
    setAction: (action: ActionType) => void;
};

export const ActionsContext = createContext<Action>({
    action: ActionType.None,
    setAction: () => {},
});

