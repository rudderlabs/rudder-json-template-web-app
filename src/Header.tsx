import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ActionType, ActionsContext } from './action';
import RudderStackLogo from './assets/images/rudderstack-logo.svg';
import GithubLogo from './assets/images/github-mark.svg';
import DocsIcon from './assets/images/docs.svg';
import SaveIcon from './assets/images/save.svg';
import LoadIcon from './assets/images/load.svg';
import { useLocation } from 'react-router-dom';

import './Header.css';

function getReadmeLink() {
  const location = useLocation();
  switch (location.pathname) {
    case '/json-template':
      return 'https://github.com/rudderlabs/rudder-json-template-engine/blob/main/readme.md';
    case '/mappings':
      return 'https://github.com/rudderlabs/rudder-json-template-engine/blob/main/readme.md#mappings';
    case '/workflow-engine':
      return 'https://github.com/rudderlabs/rudder-workflow-engine/blob/main/README.md';
    default:
      return '';
  }
}

function getGithubLink() {
  const location = useLocation();
  if (location.pathname === '/workflow-engine') {
    return 'https://github.com/rudderlabs/rudder-workflow-engine';
  }
  return 'https://github.com/rudderlabs/rudder-json-template-engine';
}

const Header = () => {
  const { setAction } = useContext(ActionsContext);

  const triggerAction = (action: ActionType) => {
    setAction(action);
  };

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
            <NavLink to="/mappings">Mappings</NavLink>
          </li>
          <li>
            <NavLink to="/workflow-engine">Workflows</NavLink>
          </li>
        </ul>
      </nav>
      <span className="icons">
        <a title="Load code" onClick={() => triggerAction(ActionType.Load)}>
          <img src={LoadIcon} className="logo" alt="Load" />
        </a>
        <a title="Save code" onClick={() => triggerAction(ActionType.Saving)}>
          <img src={SaveIcon} className="logo" alt="Save" />
        </a>
        <a target="_blank" rel="noreferrer" href={getGithubLink()}>
          <img src={GithubLogo} className="logo" alt="RuddersSource codeack" />
        </a>
        <a target="_blank" rel="noreferrer" href={getReadmeLink()}>
          <img src={DocsIcon} alt="Docs" title="Docs" />
        </a>
      </span>
    </div>
  );
};
export default Header;
