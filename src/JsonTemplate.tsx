import React, { useEffect, useState } from 'react';
import Playground from './Playground';
import Header from './Header';
import { ActionType, ActionsContext } from './action';
import { CodeType } from './types';
import { JsonTemplateEngine } from '@rudderstack/json-template-engine';

export const JsonTemplate = () => {
  useEffect(() => {
    document.title = 'Json Template Engine';
  });

  const [action, setAction] = useState<ActionType>(ActionType.None);
  const [codeName, setCodeName] = useState<string>('');

  async function executeJsonTemplate(code: string, data: any, bindings: any) {
    return JsonTemplateEngine.create(code).evaluate(data, bindings);
  }

  function parseJsonTemplate(code: string) {
    return JsonTemplateEngine.parse(code);
  }

  return (
    <ActionsContext.Provider value={{ action, setAction, codeName, setCodeName }}>
      <div className="app">
        <Header />
        <Playground
          execute={executeJsonTemplate}
          parse={parseJsonTemplate}
          type={CodeType.JsonTemplate}
        />
      </div>
    </ActionsContext.Provider>
  );
};
