import React from 'react';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import Login from './login.js';

let Nav = React.createClass({
  getInitialState: function(){
    return {
      profile: false,
      messageBox: false
    }
  },
  showProfile: function(){
    this.setState({profile: !this.state.profile});
  },
  render: function(){
    //console.log(this.props.isLogin);
    var profile;
    if(this.props.isLogin&&this.state.profile){
      profile = <div className="profile-menu">profile</div>
    }
    else if((!this.props.isLogin)&&(this.state.profile)){
      profile = <Login login={this.props.login}/>
    }
    return(
      <div className="nav red">
        <div className="logo">
          <img src="./img/logo.png" alt="logo" />
        </div>
        <Link to="/index" className="homelink"><div className="logo-letters">网易云音乐</div></Link>
        <div className="btn-group">
          <i id="btn-back" className="glyphicon glyphicon-menu-left"></i>
          <i id="btn-forward" className="glyphicon glyphicon-menu-right active"></i>
        </div>
        <div className="search-container">
          <i className="glyphicon glyphicon-search"></i>
          <input className="search" placeholder="搜索音乐，歌手，歌词，用户"/>
        </div>
        <div className="tool-right">
          <i className="glyphicon glyphicon-envelope"></i>
          <i className="glyphicon glyphicon-cog"></i>
          <div className="user">
            <div className="avatar" onClick={this.showProfile}></div>
            <span className="caret"></span>
          </div>
        </div>
        {profile}
      </div>
      
    );
  }
});

export default Nav;