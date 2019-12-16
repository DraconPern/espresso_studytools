import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import App from './app';
import About from './components/About';
import Sample from './components/Sample';
import Install from './install';

import { Provider } from 'react-redux';
import configureStore from './configureStore';

const Routes = () => (
  <Provider store={configureStore(window.__INITIAL_STATE__)}>
    <Router>
      <div>
        <Switch>
        <Route exact path="/" component={Install}/>
        <Route path="/about" component={About}/>
        <Route path="/sample" component={Sample}/>
        <Route path="/:patientStudyId" component={App}/>
        </Switch>
      </div>
    </Router>
  </Provider>
);

export default Routes;
