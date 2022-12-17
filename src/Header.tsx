import React from 'react';
import { ReactComponent as RudderStackLogo } from './assets/images/rudderstack-logo.svg';
import { ReactComponent as GithubLogo } from './assets/images/github-mark.svg';
import { ReactComponent as DocsIcon } from './assets/images/docs.svg';

import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <a target="_blank" rel="noreferrer" href="https://www.rudderstack.com/">
        <span className="main-logo">
          <RudderStackLogo className="logo" />
        </span>
      </a>

      <span className="title">
        <h2> JSON Template Engine Playground</h2>
      </span>
      <span className="icons">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/rudderlabs/rudder-json-template-engine"
        >
          <GithubLogo className="logo" title="Source code" />
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/rudderlabs/rudder-json-template-engine/blob/main/docs/syntax.md"
        >
          <DocsIcon title="Docs" />
        </a>
      </span>
    </div>
  );
};
export default Header;
