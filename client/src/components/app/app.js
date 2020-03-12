import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './app.css';

//Redux
import { Provider } from 'react-redux';
import store from '../../store';

import Navbar from '../nav-bar';
import { HomePage, LoginPage, RegistrationPage } from '../pages';

const App = () =>
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/register" component={RegistrationPage} />
          <Route exact path="/login" component={LoginPage} />
        </Switch>
      </Fragment>
    </Router>
  </Provider>

export default App;
