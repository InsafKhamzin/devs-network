import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './app.css';

import Navbar from '../nav-bar';
import {HomePage, LoginPage, RegistrationPage} from '../pages';

const App = () =>
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




export default App;
