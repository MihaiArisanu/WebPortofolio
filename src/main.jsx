import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import './assets/crt-effects.css';

const style = document.createElement('style');
style.innerHTML = `
  * {
    box-sizing: border-box;
  }
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);