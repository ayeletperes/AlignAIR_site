import React  from 'react';
import Header from './alignairPageHeader';
import Image from './images/landing_page.jpg'
import Logo from './images/alignair_logo.svg';

const assets = {
    Image,
    Logo
  }

// TODO replace the github link with the actual github link  
export default function HomePageAPP(){
    return(
        <div>
                <Header />
                <div className="content-home">
                    <h1 style={{ fontSize: '64px', fontFamily: 'Inter, sans-serif' }}>AlignAIR</h1>
                    {/* <img src={assets.Logo} alt="Computer screen with dna"  style={{ width: '200px', height: 'auto', borderRadius: '0px' }}/> */}
                    <p style={{ fontSize: '24px', fontFamily: 'Inter, sans-serif', color: "#828282"}}>Improving immunoglobulin sequence alignment.</p>
                    <a href="#/alignair" className="start-button" style={{fontSize: "20px", padding: '15px 30px'}}>Start</a>
                    <img src={assets.Image} alt="Computer screen with dna" width="800" height="600"/>
                </div>
                <footer>
                    <div className="footer-logo">AlignAIR</div>
                    <a href="https://github.com" className="github-logo">
                        <i className="fab fa-github" style={{fontSize: '24px', color: '#828282'}}></i>
                    </a>
                </footer>
        </div>
    )
};




