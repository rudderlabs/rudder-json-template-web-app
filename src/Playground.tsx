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
import Snackbar from './Snackbar';
import { ActionType, ActionsContext, getPlayground, savePlayground } from './action';
import { downloadCode, CodeType, DEFAULT_DATA, DEFAULT_BINDINGS, Code } from './types';
import { useLocation, useNavigate } from 'react-router-dom';
import { CommonUtils } from './utils';

function getCodeLanguage(type: CodeType) {
  switch (type) {
    case CodeType.JsonTemplate:
      return 'javascript';
    case CodeType.Mappings:
      return 'json';
    default:
      return 'yaml';
  }
}

function getInitailCode(type: CodeType) {
  const commentCode = type === CodeType.JsonTemplate ? '// ' : '# ';
  return type !== CodeType.Mappings
    ? `${commentCode} Enter your ${type} code here`
    : `[
    {
      "input": "$",
      "output": "$"
    }
  ]`;
}

const PlayGround = (props: {
  execute: (code: string, data: any, bindings: Record<string, any>) => Promise<any>;
  parse?: (code: string) => any;
  convert?: (code: string) => any;
  type: CodeType;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const githubGistID = queryParams.get('gist');
  const { action, setAction, codeName, codePasted, setCodePasted, setNotification } =
    useContext(ActionsContext);
  const codeObj = getPlayground(props.type);
  const codeLang = getCodeLanguage(props.type);

  const [data, setData] = useState<string | undefined>(codeObj.data ?? DEFAULT_DATA);
  const [bindings, setBindings] = useState<string | undefined>(
    codeObj.bindings ?? DEFAULT_BINDINGS,
  );
  const [code, setCode] = useState<string | undefined>(codeObj.code ?? getInitailCode(props.type));
  const [result, setResult] = useState<Result | undefined>(codeObj.result);
  const [isLoading, setLoading] = useState<boolean>(false);

  function getCode() {
    return {
      code,
      data,
      bindings,
      result,
      type: props.type,
      name: codeName,
    };
  }

  useEffect(() => {
    savePlayground(getCode());
  }, [code, data, bindings, result]);

  function loadCode(codeObj: Code) {
    if (!codeObj || typeof codeObj !== 'object') return;
    setData(codeObj.data ?? DEFAULT_DATA);
    setBindings(codeObj.bindings ?? DEFAULT_BINDINGS);
    setCode(codeObj.code ?? getInitailCode(props.type));
    setResult(codeObj.result);
  }

  useEffect(() => {
    if (!location.state?.code) {
      return;
    }
    loadCode(location.state.code);
  }, [location.state?.code]);

  useEffect(() => {
    if (!githubGistID) return; // If gistId is not provided, return early
    const fetchGist = async () => {
      try {
        const response = await fetch(`https://api.github.com/gists/${githubGistID}`);
        if (response.ok) {
          const data = await response.json();
          // Extract raw content of the first file in the gist
          const files: any[] = Object.values(data.files);
          if (files.length > 0) {
            loadCode(JSON.parse(files[0].content ?? '{}') as Code);
          } else {
            throw new Error('No files found in the Gist');
          }
        } else {
          throw new Error('Failed to fetch Gist');
        }
      } catch (error) {
        console.error('Error fetching Gist:', error);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchGist();
  }, [githubGistID]);

  useEffect(() => {
    if (action === ActionType.None) {
      return;
    }
    if (action === ActionType.Save) {
      saveCode();
      setAction(ActionType.None);
    }

    if (action === ActionType.Copy) {
      copyCode();
    }
  }, [action]);

  useEffect(() => {
    if (!codePasted) {
      return;
    }
    navigate(CommonUtils.getNavigationPath(codePasted.type), { state: { code: codePasted } });
    setNotification('Code pasted');
    setCodePasted(undefined);
  }, [codePasted]);

  function handleCodePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    if (!event.clipboardData) {
      return;
    }
    const pastedText = event.clipboardData.getData('text');
    if (!pastedText) {
      return;
    }
    if (pastedText) {
      setCodePasted(JSON.parse(pastedText) as Code);
    }
  }

  function saveCode() {
    downloadCode({ code, name: codeName, type: props.type, data, bindings, result });
  }

  async function copyCode() {
    await navigator.clipboard.writeText(JSON.stringify(getCode()));
    setNotification('Code copied');
    setAction(ActionType.None);
  }

  async function excuteCode() {
    if (!code) {
      return;
    }
    setLoading(true);
    const dataObj = JSON.parse(data ?? '{}');
    // eslint-disable-next-line no-new-func
    const bindingsObj = new Function(`${bindings ?? DEFAULT_BINDINGS};return bindings;`)();

    try {
      const output = await props.execute(code, dataObj, bindingsObj);
      setResult({ output });
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  }

  async function parseCode() {
    if (!code || !props.parse) {
      return;
    }
    try {
      setResult({ output: props.parse(code) });
    } catch (error: any) {
      setResult({ error: error.message });
    }
  }

  async function convertCode() {
    if (!code || props.type !== CodeType.Mappings || !props.convert) {
      return;
    }
    try {
      setResult({ output: props.convert(code), langugage: 'javascript' });
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
    <div style={{ ...layoutCSS, height: '85vh' }} id="playground" onPaste={handleCodePaste}>
      {isLoading && <Loader />}
      {action === ActionType.Load && <LoadCode />}
      {action === ActionType.Saving && <SaveCode />}
      <Snackbar duration={2000} />
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
              {props.type === CodeType.Mappings && (
                <button onClick={convertCode} title={`Convert ${props.type}`}>
                  Convert
                </button>
              )}
              {props.type !== CodeType.Workflow && (
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
