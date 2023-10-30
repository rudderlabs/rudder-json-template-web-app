import React from 'react';
import { NavLink } from 'react-router-dom';
import RudderStackLogo from './assets/images/rudderstack-logo.svg';
import GithubLogo from './assets/images/github-mark.svg';
import DocsIcon from './assets/images/docs.svg';

import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <a target="_blank" rel="noreferrer" href="https://www.rudderstack.com/">
        <span className="main-logo">
          <img src={RudderStackLogo} className="logo" alt="Rudderstack" />
        </span>
      </a>

      <span className="title">
        <h2> Integrations Playground</h2>
      </span>
      <nav className="links">
        <ul>
          <li>
            <NavLink to="/json-template">Json Templates</NavLink>
          </li>
          <li>
            <NavLink to="/workflow-engine">Workflows</NavLink>
          </li>
        </ul>
      </nav>
      <span className="icons">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/rudderlabs/rudder-json-template-engine"
        >
          <img src={GithubLogo} className="logo" alt="RuddersSource codeack" />
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/rudderlabs/rudder-json-template-engine/blob/main/docs/syntax.md"
        >
          <img src={DocsIcon} alt="Docs" title="Docs" />
        </a>
      </span>
    </div>
  );
};
export default Header;
