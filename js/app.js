import React from 'react';
import ReactDom from 'react-dom';
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
action.init();

let App = React.createClass({
  getInitialState: function(){
    var that = this;
    store.setState = function(data){
      that.setState(data);
    }
    store.getState = function(){
      return that.state;
    }
    return store.getInitState();
  }, 
  login: function(username, password){
    action.login(username, password);
  },
  action: function(method, data){
    action.dispatch(method, data);
  },
  componentDidMount: function(){
    document.location = "#/index";
  },
  render: function(){
    console.log(this.state);
    var { ...other } = this.state;
    return (
      <div className="full">
        <Toolbar />
        <Nav {...other} login={this.login}/>
          <Sidebar />
          <RouteHandler {...other}/>
        <Player playList={this.state.playList} action={this.action}/>
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

export default App;
