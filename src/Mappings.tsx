import React, { useEffect } from 'react';
import Playground from './Playground';
import Header from './Header';
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
    <div className="app">
      <Header />
      <Playground
        execute={executeMappings}
        parse={parseMappings}
        convert={convertMappings}
        type={CodeType.Mappings}
      />
    </div>
  );
};
