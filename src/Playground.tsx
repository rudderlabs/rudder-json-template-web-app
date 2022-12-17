import React, { useState } from 'react';
import { JsonTemplateEngine } from 'rudder-json-template-engine';
import SplitPane from 'split-pane-react';
import Editor from '@monaco-editor/react';
import 'split-pane-react/esm/themes/default.css';
import ShowResult from './ShowResult';
import './Playground.css';
import { Result } from './types';
import Loader from './Loader';
import { CommonUtils } from './utils';

const TIMEOUT = 15000;

const DEFAULT_TEMPLATE = `/*
* Note: Currently we are using javascript editor and JSON template
* uses custom syntax. It won't be recognized by this editor so
* you will see syntax errors. It won't effect the functionality 
* of JSON template so please ignore these errors.
*/
`;

const DEFAULT_DATA = `{
  "description": "Enter your data here"
}`;

const DEFAULT_BINDINGS = `{
  "description": "Enter your bindings here"
}`;

const PlayGround = () => {
  const [data, setData] = useState<string | undefined>('{}');
  const [bindings, setBindings] = useState<string | undefined>('{}');
  const [template, setTemplate] = useState<string | undefined>('// Enter Json template');
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

  const executeTemplate = async () => {
    if (!template) {
      return;
    }
    setExecuting(true);
    const dataObj = JSON.parse(data || '{}');
    const bindingsObj = JSON.parse(bindings || '{}');
    try {
      const output = await CommonUtils.resolveWithTimeout(
        JsonTemplateEngine.create(template).evaluate(dataObj, bindingsObj),
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
            <Editor defaultLanguage="json" defaultValue={DEFAULT_BINDINGS} onChange={setBindings} />
          </div>
        </SplitPane>
        <SplitPane split="horizontal" sizes={sizes2} onChange={setSizes2} sashRender={sashRender}>
          <div style={layoutCSS} title="Enter JSON Template">
            <Editor
              defaultLanguage="javascript"
              defaultValue={DEFAULT_TEMPLATE}
              onChange={setTemplate}
            />
            <div className="execute" title="Execute JSON Template">
              <button onClick={executeTemplate}>Execute</button>
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
