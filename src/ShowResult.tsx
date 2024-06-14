import Editor from '@monaco-editor/react';
import './ShowResult.css';
import { Result } from './types';

function getResultValue(result: Result) {
  if(result.langugage === 'javascript') {
    return result.output;
  }
  return JSON.stringify(result.output, null, 2);
}

function getCodeLanguage(result: Result) {
  return result.langugage || 'json';
}

const ShowResult = (props: { result?: Result }) => {
  const result = props.result;
  if (!result) {
    return <div className="no-result">Enter code to see the output</div>;
  }
  if (result.error) {
    return <span className="error">{result.error}</span>;
  }
  if (!result.output) {
    return <span>Empty Output</span>;
  }
  return (
    <Editor
      defaultLanguage={getCodeLanguage(result)}
      value={getResultValue(result)}
      options={{ readOnly: true }}
    />
  );
};

export default ShowResult;
