import React, { useContext, useEffect, useState } from 'react';
import SplitPane from 'split-pane-react';
import Editor from '@monaco-editor/react';
import 'split-pane-react/esm/themes/default.css';
import ShowResult from './ShowResult';
import './Playground.css';
import { Result } from './types';
import Loader from './Loader';
import LoadCode from './LoadCode';
import SaveCode from './SaveCode';
import { ActionType, ActionsContext } from './action';
import { downloadCode, CodeType, DEFAULT_DATA, DEFAULT_BINDINGS, Code } from './code';
import { useLocation } from 'react-router-dom';
import { parse } from 'path';

const PlayGround = (props: {
  execute: (code: string, data: any, bindings: Record<string, any>) => Promise<any>;
  parse?: (code: string) => any;
  type: CodeType;
}) => {
  const location = useLocation();
  const codeObj = (location.state?.code || {}) as Code;

  const codeLang = props.type === CodeType.JsonTemplate ? 'javascript' : 'yaml';
  const commentCode = props.type === CodeType.JsonTemplate ? '// ' : '# ';
  const initialCode = `${commentCode} Enter your ${props.type} code here`;

  const { action, setAction, codeName } = useContext(ActionsContext);
  const [data, setData] = useState<string | undefined>(DEFAULT_DATA);
  const [bindings, setBindings] = useState<string | undefined>(DEFAULT_BINDINGS);
  const [code, setCode] = useState<string | undefined>(initialCode);
  const [result, setResult] = useState<Result | undefined>();
  const [isExecuting, setExecuting] = useState<boolean>(false);

  useEffect(() => {
    if (codeObj.code) {
      setCode(codeObj.code);
    }
    if (codeObj.data) {
      setData(codeObj.data);
    }
    if (codeObj.bindings) {
      setBindings(codeObj.bindings);
    }
  }, [codeObj]);

  useEffect(() => {
    if (action === ActionType.None) {
      return;
    }
    if (action === ActionType.Save) {
      saveCode();
      setAction(ActionType.None);
    }
  }, [action]);

  function saveCode() {
    downloadCode({ code, name: codeName, type: props.type, data, bindings });
  }

  async function excuteCode() {
    if (!code) {
      return;
    }
    setExecuting(true);
    const dataObj = JSON.parse(data || '{}');
    // eslint-disable-next-line no-new-func
    const bindingsObj = new Function(`${bindings || DEFAULT_BINDINGS};return bindings;`)();

    try {
      const output = await props.execute(code, dataObj, bindingsObj);
      setResult({ output });
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setExecuting(false);
  }

  async function parseCode() {
    if (!code || props.type !== CodeType.JsonTemplate || !props.parse) {
      return;
    }
    try {
      setResult({ output: props.parse(code) });
    } catch (error: any) {
      setResult({ error: error.message });
    }
  }

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

  return (
    <div style={{ ...layoutCSS, height: '85vh' }}>
      {isExecuting && <Loader />}
      {action === ActionType.Load && <LoadCode />}
      {action === ActionType.Saving && <SaveCode />}

      <SplitPane split="vertical" sizes={sizes} onChange={setSizes} sashRender={sashRender}>
        <SplitPane split="horizontal" sizes={sizes1} onChange={setSizes1} sashRender={sashRender}>
          <div style={layoutCSS} title="Enter Data">
            <Editor defaultLanguage="json" value={data} onChange={setData} />
          </div>
          <div style={layoutCSS} title="Enter Bindings">
            <Editor defaultLanguage="javascript" value={bindings} onChange={setBindings} />
          </div>
        </SplitPane>
        <SplitPane split="horizontal" sizes={sizes2} onChange={setSizes2} sashRender={sashRender}>
          <div style={layoutCSS} title={`Enter ${props.type} Code`}>
            <Editor defaultLanguage={codeLang} value={code} onChange={setCode} />
            <div className="playground-button">
              {props.type === CodeType.JsonTemplate && (
                <button onClick={parseCode} title={`Parse ${props.type}`}>
                  Parse
                </button>
              )}
              <button onClick={excuteCode} title={`Execute ${props.type}`}>
                Execute
              </button>
            </div>
          </div>

          <div className="result" title="Result">
            <ShowResult result={result} />
          </div>
        </SplitPane>
      </SplitPane>
    </div>
  );
};
export default PlayGround;
