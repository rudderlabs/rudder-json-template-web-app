import React, { useEffect, useState } from 'react';
import Playground from './Playground';
import Header from './Header';
import { ActionType, ActionsContext } from './action';
import { CodeType } from './types';
import {
  Expression,
  FlatMappingPaths,
  JsonTemplateEngine,
  PathType,
} from '@rudderstack/json-template-engine';

export const Mappings = () => {
  useEffect(() => {
    document.title = 'Json Template Mappings';
  });

  const [action, setAction] = useState<ActionType>(ActionType.None);
  const [codeName, setCodeName] = useState<string>('');

  function parseMappings(code: string): Expression {
    const mappings = JSON.parse(code) as FlatMappingPaths[];
    return JsonTemplateEngine.parse(mappings, { defaultPathType: PathType.JSON });
  }

  async function executeMappings(code: string, data: any, bindings: any) {
    const expr = parseMappings(code);
    return JsonTemplateEngine.create(expr, { defaultPathType: PathType.JSON }).evaluate(
      data,
      bindings,
    );
  }

  function convertMappings(code: string) {
    const expr = parseMappings(code);
    return JsonTemplateEngine.reverseTranslate(expr, {
      defaultPathType: PathType.JSON,
    });
  }

  return (
    <ActionsContext.Provider value={{ action, setAction, codeName, setCodeName }}>
      <div className="app">
        <Header />
        <Playground
          execute={executeMappings}
          parse={parseMappings}
          convert={convertMappings}
          type={CodeType.Mappings}
        />
      </div>
    </ActionsContext.Provider>
  );
};
