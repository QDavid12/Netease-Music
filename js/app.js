import React from 'react';
import ReactDom from 'react-dom';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler, IndexRoute } from 'react-router';

import Discover from './components/discover.js';
import Songlist from './components/songlist.js';
import Radio from './components/radio.js';

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
  playRadio:function(num){
    console.log("playRadio "+num);
    var radioNum = this.state.radioNum;
    this.setState({radioNum: num, mode: "radio", restart: true});
    if(this.state.radio[radioNum+3]==undefined){
      console.log("load more");
      this.action("getNewRadio", {});
    }
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
          <Sidebar userSonglist={this.state.userSonglist} action={this.action}/>
          <RouteHandler {...other} action={this.action} playRadio={this.playRadio}/>
        <Player mode={this.state.mode} radio={this.state.radio} playList={this.state.playList} didRestart={this.didRestart} restart={this.state.restart} radioNum={this.state.radioNum}start={this.state.start} action={this.action} nextRadio={this.nextRadio} lastRadio={this.lastRadio}/>
      </div>
    )
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="discover" path="/discover" handler={Discover}/>
    <Route name="songlist" path="/songlist/:id" handler={Songlist}/>
    <Route name="radio" path="/radio" handler={Radio}/>
  </Route>
);

Router.run(routes, function (Handler) {
  ReactDom.render(<Handler />, document.getElementById("app"));
});

export default App;
