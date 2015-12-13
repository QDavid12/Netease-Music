import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import LoginHandler from './login.js';

import Toolbar from './toolbar.js';
import Nav from './nav.js';
import Sidebar from './sidebar.js';
import Player from './player.js';

//var store = require('./store');
var action = require('./Action');

let App = React.createClass({
  getInitialState: function(){
      return {
          isLogin: false,
      };
  },
  login: function(username, password){
    var resp;
    action.login({
      username: username,
      password: password
    }, function(data){
      console.log(data);
      resp = data;
    })
    console.log(resp);

  },
  render: function(){
    return (
      <div className="full">
        <Toolbar />
        <Nav />
          <Sidebar />
          <RouteHandler className="main-container" login={this.login}/>
        <Player />
      </div>
    )
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="login" path="/login" handler={LoginHandler}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler />, document.body);
});

