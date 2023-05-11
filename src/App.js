import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import Login from './containers/login'
import Admin from './containers/admin'
export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/admin" component={Admin}></Route>
          <Redirect to="/admin" />
        </Switch>
      </div>
    )
  }
}
