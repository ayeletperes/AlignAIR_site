import React from 'react';
import Logo from './images/alignair_logo.svg';

const assets = {
  Logo
  }

const Header = () => (
  <header>
    {/* <div className="logo">AlignAIR</div> */}
    <div className="logo">
      <img src={assets.Logo} alt="logo" style={{ width: '100px', height: 'auto', borderRadius: '0px' }}/>
    </div>
    <nav>
      <a href="#/">Home</a>
      <a href="#/alignair">AlignAIR tool</a>
      {/* <a href="#">Help</a>
      <a href="#">About</a> */}
    </nav>
  </header>
);

export default Header;
