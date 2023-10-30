import React, { useState } from 'react';
import { TemplateType, WorkflowEngineFactory } from '@rudderstack/workflow-engine';
import SplitPane from 'split-pane-react';
import Editor from '@monaco-editor/react';
import 'split-pane-react/esm/themes/default.css';
import ShowResult from '../ShowResult';
import './Playground.css';
import { Result } from '../types';
import Loader from '../Loader';
import { CommonUtils } from '../utils';

const TIMEOUT = 15000;

const DEFAULT_WORKFLOW = `# Enter your workflow YAML code here`;

const DEFAULT_DATA = `{
  "description": "Enter your data here"
}`;

const DEFAULT_BINDINGS = `const bindings = {
  "description": "Enter your bindings here"
};`;

async function createAndExecuteWorkflow(workflow: string, data: any, bindings: any): Promise<any> {
  const workflowEngine = await WorkflowEngineFactory.createFromYaml(workflow, {
    rootPath: '',
    templateType: TemplateType.JSON_TEMPLATE,
    creationTimeBindings: bindings,
  });
  const output = await workflowEngine.execute(data);
  return output;
}

const PlayGround = () => {
  const [data, setData] = useState<string | undefined>(DEFAULT_DATA);
  const [bindings, setBindings] = useState<string | undefined>(DEFAULT_BINDINGS);
  const [workflow, setWorkflow] = useState<string | undefined>(DEFAULT_WORKFLOW);
  const [result, setResult] = useState<Result | undefined>();
  const [isExecuting, setExecuting] = useState<boolean>(false);

  const [sizes, setSizes] = useState<(number | string)[]>(['100vh', 'auto']);
  const [sizes1, setSizes1] = useState<(number | string)[]>(['100vh', 'auto']);
  const [sizes2, setSizes2] = useState<(number | string)[]>(['100vh', 'auto']);

  const layoutCSS = {
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    border: '1px solid #ddd',
    background: '#fff',
  };
  const sashRender = () => <div></div>;

  const executeWorkflow = async () => {
    if (!workflow) {
      return;
    }
    setExecuting(true);
    const dataObj = JSON.parse(data || '{}');
    // eslint-disable-next-line no-new-func
    const bindingsObj = new Function(`${bindings || DEFAULT_BINDINGS};return bindings;`)();

    try {
      const output = await CommonUtils.resolveWithTimeout(
        createAndExecuteWorkflow(workflow, dataObj, bindingsObj),
        TIMEOUT,
      );
      setResult({ output });
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div style={{ ...layoutCSS, height: '85vh' }}>
      {isExecuting && <Loader />}
      <SplitPane split="vertical" sizes={sizes} onChange={setSizes} sashRender={sashRender}>
        <SplitPane split="horizontal" sizes={sizes1} onChange={setSizes1} sashRender={sashRender}>
          <div style={layoutCSS} title="Enter Data">
            <Editor defaultLanguage="json" defaultValue={DEFAULT_DATA} onChange={setData} />
          </div>
          <div style={layoutCSS} title="Enter Bindings">
            <Editor
              defaultLanguage="javascript"
              defaultValue={DEFAULT_BINDINGS}
              onChange={setBindings}
            />
          </div>
        </SplitPane>
        <SplitPane split="horizontal" sizes={sizes2} onChange={setSizes2} sashRender={sashRender}>
          <div style={layoutCSS} title="Enter Worflow YAML">
            <Editor defaultLanguage="yaml" defaultValue={DEFAULT_WORKFLOW} onChange={setWorkflow} />
            <div className="execute" title="Execute Workflow">
              <button onClick={executeWorkflow}>Execute</button>
            </div>
          </div>

          <div
            style={{
              height: '100%',
              border: '1px solid #ddd',
              padding: '10px',
              textAlign: 'center',
            }}
            title="Result"
          >
            <ShowResult result={result} />
          </div>
        </SplitPane>
      </SplitPane>
    </div>
  );
};
export default PlayGround;
