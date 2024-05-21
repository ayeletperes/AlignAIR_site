import React from 'react';

const Header = () => (
  <header>
    {/* <div className="logo">AlignAIR</div> */}
    <div className="logo">
      <img src='./logo.svg' alt="AlignAIR" style={{ width: '100px', height: '100px', borderRadius: '0px' }}/>
    </div>
    <nav>
      <a href="/">Home</a>
      <a href="/alignair">AlignAIR tool</a>
      <a href="#">Help</a>
      <a href="#">About</a>
    </nav>
  </header>
);

export default Header;
