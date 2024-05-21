import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { initializeIcons } from "@fluentui/react/lib/Icons";
import HomePageAPP from "./homePage";
import ToolPageApp from "./toolPage";

// initializeIcons(/* optional base url */);

const Routing = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePageAPP />} />
      <Route path="/alignair" element={<ToolPageApp />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <HashRouter>
      <Routing />
    </HashRouter>
  </StrictMode>,
  rootElement
);


// ReactDOM.render(<App />, document.getElementById('root'));