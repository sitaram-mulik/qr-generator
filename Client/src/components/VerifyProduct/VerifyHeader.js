import { memo } from 'react';
import logo from './assets/logo.png';

const VerifyHeader = () => {
  return (
    <nav className="verify-nav">
      <div className="nav-overlay"></div>
      <div className="res-container">
        <a href="#section_banner" className="navbar-brand">
          <img src={logo} alt="GAT Sport" />
        </a>
      </div>
    </nav>
  );
};

export default memo(VerifyHeader);
