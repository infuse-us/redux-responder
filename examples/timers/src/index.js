
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import { timerResponder } from './responders';
import App from './components/App';
import { connect } from '../../../src/index';

// Connect responders to the store
connect([timerResponder], store);

// Connect App component to the store
const ConnectedApp = <Provider store={store}><App /></Provider>;

// Render the connected App
const root = document.createElement('div');
document.body.appendChild(root);
render(ConnectedApp, root);
