import React from 'react';
import ReactDom from 'react-dom';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler, IndexRoute } from 'react-router';

import Discover from './components/discover.js';
import Songlist from './components/songlist.js';

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
    var state = store.getInitState();
    this.isLogin = state.isLogin;
    return state;
  }, 
  login: function(username, password){
    action.login(username, password);
  },
  action: function(method, data){
    action.dispatch(method, data);
  },
  componentDidMount: function(){
    document.location = "#/discover";
    if(this.state.isLogin==true){
      this.isLogin = true;
      this.action("userSonglist", {});
    }
  },
  componentDidUpdate: function(){
    if(this.isLogin==false&&this.state.isLogin==true){
      this.isLogin = true;
      this.action("userSonglist", {});
    }
  },
  didRestart: function(){
    this.setState({restart: false});
  },
  render: function(){
    console.log("app render");
    //console.log(this.state);
    var { ...other } = this.state;
    return (
      <div className="full">
        <Toolbar />
        <Nav {...other} login={this.login}/>
          <Sidebar userSonglist={this.state.userSonglist} action={this.action}/>
          <RouteHandler currentSonglist={this.state.currentSonglist} action={this.action}/>
        <Player playList={this.state.playList} didRestart={this.didRestart} restart={this.state.restart} start={this.state.start} action={this.action}/>
      </div>
    )
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="discover" path="/discover" handler={Discover}/>
    <Route name="songlist" path="/songlist/:id" handler={Songlist}/>
  </Route>
);

Router.run(routes, function (Handler) {
  ReactDom.render(<Handler />, document.getElementById("app"));
});

export default App;
