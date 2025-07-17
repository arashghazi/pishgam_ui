import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Main from './Main';
import './helpers/initFA';
import ErrorHandler from './Engine/ErrorHandler';

ReactDOM.render(
    <Main >
        <ErrorHandler>
            <App />
        </ErrorHandler>
  </Main>,
  document.getElementById('main')
);
