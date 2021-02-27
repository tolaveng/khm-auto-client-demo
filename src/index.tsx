// Render React App
import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './React/App';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';
import { store, StoreContext } from './React/stores';

ReactDOM.render(
    <StoreContext.Provider value={store}>
        <App />
    </StoreContext.Provider>,
    document.getElementById('root'),
);
