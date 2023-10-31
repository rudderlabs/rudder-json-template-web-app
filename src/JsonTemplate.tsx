import React, { useEffect, useState } from 'react';
import Playground from './Playground';
import Header from './Header';
import { ActionType, ActionsContext } from './action';
import { CodeType } from './code';
import { JsonTemplateEngine } from '@rudderstack/json-template-engine';

export const JsonTemplate = () => {
  useEffect(() => {
    document.title = 'Json Template Engine';
  });

  const [action, setAction] = useState<ActionType>(ActionType.None);

  async function executeJsonTemplate(code: string, data: any, bindings: any) {
    if (!code) {
      return;
    }
    try {
      return JsonTemplateEngine.create(code).evaluate(data, bindings);
    } catch (error: any) {
      return { error: error.message };
    }
  }

  return (
    <ActionsContext.Provider value={{ action, setAction }}>
      <div className="app">
        <Header />
        <Playground execute={executeJsonTemplate} type={CodeType.JsonTemplate} />
      </div>
    </ActionsContext.Provider>
  );
};
