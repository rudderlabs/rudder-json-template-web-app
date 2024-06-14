import React, { useEffect, useState } from 'react';
import Playground from './Playground';
import Header from './Header';
import { ActionType, ActionsContext } from './action';
import { CodeType } from './types';
import { FlatMappingPaths, JsonTemplateEngine, PathType } from '@rudderstack/json-template-engine';

export const Mappings = () => {
  useEffect(() => {
    document.title = 'Json Template Mappings';
  });

  const [action, setAction] = useState<ActionType>(ActionType.None);
  const [codeName, setCodeName] = useState<string>('');

  async function executeMappings(code: string, data: any, bindings: any) {
    const mappings = JSON.parse(code) as FlatMappingPaths[];
    return JsonTemplateEngine.create(mappings, { defaultPathType: PathType.JSON }).evaluate(
      data,
      bindings,
    );
  }

  function parseMappings(code: string) {
    const mappings = JSON.parse(code) as FlatMappingPaths[];
    return JsonTemplateEngine.parse(mappings);
  }

  function convertMappings(code: string) {
    console.log(code);
    const mappings = JSON.parse(code) as FlatMappingPaths[];
    return JsonTemplateEngine.convertMappingsToTemplate(mappings, {
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
