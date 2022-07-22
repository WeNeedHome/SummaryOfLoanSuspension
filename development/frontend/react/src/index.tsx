import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import App from "./App";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);


root.render(
    //  https://stackoverflow.com/a/72371185/9422455
    <App/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
