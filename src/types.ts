export enum CodeType {
  JsonTemplate = 'JsonTemplate',
  Mappings = 'Mappings',
  Workflow = 'Workflow',
}

export type Code = {
  name: string;
  data?: string;
  type: CodeType;
  bindings?: string;
  code?: string;
};

export function downloadCode(code: Code) {
  if (!code) {
    return;
  }
  const element = document.createElement('a');
  const file = new Blob([JSON.stringify(code)], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `${code.type}-${code.name}-${Date.now()}.json`;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  // remove element
  document.body.removeChild(element);
}

export const DEFAULT_DATA = `{
    "description": "Enter your data here"
  }`;

export const DEFAULT_BINDINGS = `const bindings = {
    "description": "Enter your bindings here"
  };`;

export type Result = {
  output?: any;
  error?: string;
};
