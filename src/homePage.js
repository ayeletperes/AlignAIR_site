import React  from 'react';
import Header from './alignairPageHeader';
import Image from './images/landing_page.jpg'

const assets = {
    Image
  }

  
export default function HomePageAPP(){
    return(
        <div>
                <Header />
                <div className="content-home">
                    <h1 style={{ fontSize: '64px', fontFamily: 'Inter, sans-serif' }}>AlignAIR</h1>
                    <p style={{ fontSize: '24px', fontFamily: 'Inter, sans-serif', color: "#828282"}}>Improving immunoglobulin sequence alignment.</p>
                    <a href="#/tool" className="start-button" style={{fontSize: "20px", padding: '15px 30px'}}>Start</a>
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




