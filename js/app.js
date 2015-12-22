import React from 'react';
import ReactDom from 'react-dom';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler, Redirect } from 'react-router';

import Discover from './components/discover.js';
import Songlist from './components/songlist.js';
import Radio from './components/radio.js';
import Artist from './components/artist.js';

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
  login: function(username, password){
    action.login(username, password);
  },
  action: function(method, data){
    action.dispatch(method, data);
  },
  getUrl: function(id){
    return action.getUrl(id);
  },
  componentDidMount: function(){
    //document.location = "#/discover";
    if(this.state.isLogin==true){
      this.isLogin = true;
      this.action("userSonglist", {});
      this.action("getNewRadio");
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
  nextRadio: function(){
    console.log("nextRadio");
    var radioNum = this.state.radioNum;
    this.setState({radioNum: this.state.radioNum+1, restart: true});
    if(this.state.radio[radioNum+3]==undefined){
      console.log("load more");
      this.action("getNewRadio", {});
    }
  },
  lastRadio: function(){
    var radioNum = this.state.radioNum;
    if(this.state.radio[radioNum-1]!=undefined){
      this.setState({radioNum: this.state.radioNum-1, restart: true});
    }
    //this.setState({radioNum: this.state.radioNum-1, restart: true});
  },
  render: function(){
    console.log("app render");
    //console.log(this.state);
    var { ...other } = this.state;
    return (
      <div className="full">
        <Toolbar action={this.action} />
        <Nav {...other} login={this.login}/>
          <Sidebar uid={this.state.account.id} radio={this.state.radio} userSonglist={this.state.userSonglist} action={this.action}/>
          <RouteHandler {...other} action={this.action}/>
        <Player {...other} getUrl={this.getUrl} action={this.action}/>
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
    <Redirect to="discover"/>
  </Route>
);

Router.run(routes, function (Handler) {
  ReactDom.render(<Handler />, document.getElementById("app"));
});

export default App;
