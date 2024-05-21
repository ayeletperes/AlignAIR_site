import React from 'react';

export default function Footer(){
  return(
    <>
      <footer style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        zIndex: 1000
      }}>
          <div className="footer-logo">AlignAIR</div>
          <a href="https://github.com" className="github-logo">
            <i className="fab fa-github" style={{fontSize: '24px', color: '#828282'}}></i>
          </a>
      </footer>
    </>
  )
};



