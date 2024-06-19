import React, { useEffect, useState } from 'react';
import Playground from './Playground';
import Header from './Header';
import { ActionType, ActionsContext } from './action';
import { CodeType } from './types';
import { FlatMappingPaths, JsonTemplateEngine, PathType } from '@rudderstack/json-template-engine';

export const JsonTemplate = () => {
  useEffect(() => {
    document.title = 'Json Templates';
  });

  async function executeJsonTemplate(code: string, data: any, bindings: any) {
    return JsonTemplateEngine.create(code).evaluate(data, bindings);
  }

  function parseJsonTemplate(code: string) {
    return JsonTemplateEngine.parse(code);
  }

  function convertMappings(code: string) {
    try {
      const mappings = JSON.parse(code) as FlatMappingPaths[];
      return JsonTemplateEngine.convertMappingsToTemplate(mappings, {
        defaultPathType: PathType.JSON,
      });
    } catch (error: any) {
      throw new Error('Invalid mappings');
    }
  }

  return (
    <div className="app">
      <Header />
      <Playground
        execute={executeJsonTemplate}
        parse={parseJsonTemplate}
        convert={convertMappings}
        type={CodeType.JsonTemplate}
      />
    </div>
  );
};
