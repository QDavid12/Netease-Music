import React from 'react';
import ReactDom from 'react-dom';
import { render } from 'react-dom';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler, IndexRoute } from 'react-router';

import Login from './components/login.js';
import Index from './components/index.js';

import Toolbar from './components/toolbar.js';
import Nav from './components/nav.js';
import Sidebar from './components/sidebar.js';
import Player from './components/player.js';

var store = require('./Store');
var action = require('./Action');

console.log("app init");

let App = React.createClass({
  getInitialState: function(){
      return {
          isLogin: false
      };
  }, 
  login: function(username, password){
    var that = this;
    action.login({
      username: username,
      password: password
    }, function(data){
      //console.log(data);
      that.setState({isLogin: true, profile: data.profile, account: data.account, bindings: data.bindings});
      console.log("account");
      console.log(that.state.account);
    });
  },
  componentDidMount: function(){
    document.location = "#/index";
  },
  render: function(){
    var { ...other } = this.state;
    return (
      <div className="full">
        <Toolbar />
        <Nav {...other} login={this.login}/>
          <Sidebar />
          <RouteHandler {...other}/>
        <Player />
      </div>
    )
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="index" path="/index" handler={Index}/>
  </Route>
);

Router.run(routes, function (Handler) {
  ReactDom.render(<Handler />, document.getElementById("app"));
});

