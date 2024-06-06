import React, { useEffect, useState } from 'react';
import Header from './Header';
import Playground from './Playground';
import { ActionType, ActionsContext } from './action';
import { TemplateType, WorkflowEngineFactory } from '@rudderstack/workflow-engine';
import { CommonUtils } from './utils';
import { CodeType } from './types';

export const Workflow = () => {
  useEffect(() => {
    document.title = 'Workflow Engine';
  });
  const [action, setAction] = useState<ActionType>(ActionType.None);
  const [codeName, setCodeName] = useState<string>('');

  async function createAndExecuteWorkflow(
    workflow: string,
    data: any,
    bindings: Record<string, any>,
  ): Promise<any> {
    const workflowEngine = await WorkflowEngineFactory.createFromYaml(workflow, {
      rootPath: '',
      templateType: TemplateType.JSON_TEMPLATE,
      creationTimeBindings: bindings,
    });
    const output = await workflowEngine.execute(data);
    return output;
  }

  async function executeWorkflow(code: string, data: any, bindings: Record<string, any>) {
    if (!code) {
      return;
    }
    try {
      const output = await CommonUtils.resolveWithTimeout(
        createAndExecuteWorkflow(code, data, bindings),
        CommonUtils.DEFAULT_TIMEOUT,
      );
      return output;
    } catch (error: any) {
      return { error: error.message };
    }
  }

  return (
    <ActionsContext.Provider value={{ action, setAction, setCodeName, codeName }}>
      <div className="app">
        <Header />
        <Playground execute={executeWorkflow} type={CodeType.Workflow} />
      </div>
    </ActionsContext.Provider>
  );
};
