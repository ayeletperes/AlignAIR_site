import React from 'react';
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from 'react-router-dom';
import { Route, Routes, Navigate } from 'react-router-dom';
// import { initializeIcons } from "@fluentui/react/lib/Icons";
import HomePageAPP from "./homePage";
import ToolPageApp from "./toolPage";

// initializeIcons(/* optional base url */);

const Routing = () => (
  <Routes>
    <Route path="/" element={<HomePageAPP />} />
    <Route path="/alignair" element={<ToolPageApp />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const rootElement = document.getElementById("root");

// ReactDOM.render(
//   <StrictMode>
//     <Router>
//       <Routing />
//     </Router>
//   </StrictMode>,
//   rootElement
// );

// for github pages
ReactDOM.render(
  <StrictMode>
    <HashRouter>
      <Routing />
    </HashRouter>
  </StrictMode>,
  rootElement
);

// ReactDOM.render(<App />, document.getElementById('root'));