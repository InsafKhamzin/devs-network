import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './app.css';

//Redux
import { Provider } from 'react-redux';
import store from '../../store';

import Navbar from '../nav-bar';
import { HomePage, LoginPage, RegistrationPage } from '../pages';
import Alert from '../alert';
import { loadUser } from '../../actions/auth';
import setAuthToken from '../../utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(()=>{
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Alert />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/register" component={RegistrationPage} />
            <Route exact path="/login" component={LoginPage} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  )
};


export default App;
