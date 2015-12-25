import React from 'react';
import ReactDom from 'react-dom';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler, Redirect } from 'react-router';

import Discover from './components/discover.js';
import Songlist from './components/songlist.js';
import Radio from './components/radio.js';
import Artist from './components/artist.js';
import Download from './components/download.js';
import User from './components/user.js';
import Album from './components/album.js';

import Toolbar from './components/toolbar.js';
import Nav from './components/nav.js';
import Sidebar from './components/sidebar.js';
import Player from './components/player.js';

var store = require('./Store');
var action = require('./Action');
var alert = require('./components/alert').alert;
action.init();

let App = React.createClass({
  getInitialState: function(){
    var that = this;
    store.setState = function(data){
      that.setState(data);
    }
    store.getState = function(key){
      if(key==undefined){
        return that.state;
      }
      else{
        return that.state[key];
      }
    }
    var state = store.getInitState();
    this.isLogin = state.isLogin;
    return state;
  },
  action: function(method, data){
    action.dispatch(method, data);
  },
  componentDidMount: function(){
    //document.location = "#/discover";
    if(this.state.isLogin==true){
      this.isLogin = true;
      action.getUserState();
    }
    // online
    window.addEventListener("online", function(e){
      console.log("fafa");
      alert("网络已连接");
      action.switchOnlineMode(true);
      this.setState({online: true});
    }.bind(this));
    // offline
    window.addEventListener("offline", function(e){
      console.log("fafa");
      alert("网络已断开");
      action.switchOnlineMode(false);
      this.setState({online: false});
    }.bind(this)); 
  },
  componentDidUpdate: function(){
    if(this.isLogin==false&&this.state.isLogin==true){
      this.isLogin = true;
      action.getUserState();
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
        <Toolbar/>
        <Nav {...other}/>
          <Sidebar uid={this.state.isLogin?this.state.account.id:0} radio={this.state.radio} userSonglist={this.state.userSonglist}/>
          <RouteHandler {...other}/>
        <Player {...other}/>
      </div>
    )
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="discover" path="/discover" handler={Discover}/>
    <Route name="songlist" path="/songlist/:id" handler={Songlist}/>
    <Route name="radio" path="/radio" handler={Radio}/>
    <Route name="artist" path="/artist/:id" handler={Artist}/>
    <Route name="user" path="/user/:id" handler={User}/>
    <Route name="album" path="/album/:id" handler={Album}/>
    <Route name="download" path="/download" handler={Download}/>
    <Redirect to="discover"/>
  </Route>
);

Router.run(routes, function (Handler) {
  ReactDom.render(<Handler />, document.getElementById("app"));
});

export default App;
