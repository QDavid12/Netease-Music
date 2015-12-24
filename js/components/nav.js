import React from 'react';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import Login from './login.js';

let Nav = React.createClass({
  getInitialState: function(){
    return {
      profileBox: this.props.profileBox,
      messageBox: this.props.messageBox,
      back: false,
      forward: false
    }
  },
  showProfile: function(){
    this.setState({profileBox: !this.state.profileBox});
  },
  back: function(){
    console.log(history.length);
    this.setState({back: !(history.back()==undefined)})
  },
  forward: function(){
    console.log(history.length);
    this.setState({forward: !(history.forward()==undefined)})
  },
  render: function(){
    var profile;
    if(this.props.isLogin&&this.state.profileBox){
      profile = <div className="profile-menu">{this.props.profile.nickname}</div>
    }
    else if((!this.props.isLogin)&&(this.state.profileBox)){
      profile = <Login login={this.props.login}/>
    }
    return(
      <div className="nav red">
        <div className="logo">
          <img src="./img/logo.png" alt="logo" />
        </div>
        <Link to="/discover" className="homelink"><div className="logo-letters">网易云音乐</div></Link>
        <div className="btn-group">
          <i onClick={this.back} id="btn-back" className={"glyphicon glyphicon-menu-left"+(this.state.back?" active":"")}></i>
          <i onClick={this.forward} id="btn-forward" className={"glyphicon glyphicon-menu-right"+(this.state.forward?" active":"")}></i>
        </div>
        <div className="search-container">
          <i className="glyphicon glyphicon-search"></i>
          <input className="search" placeholder="搜索音乐，歌手，歌词，用户"/>
        </div>
        <div className="tool-right">
          <i className="glyphicon glyphicon-envelope"></i>
          <i className="glyphicon glyphicon-cog"></i>
          <div className="user" onClick={this.showProfile}>
            <div className="avatar"><img src={this.props.isLogin?this.props.profile.avatarUrl:"./img/logo.png"}/></div>
            <span className="caret"></span>
          </div>
        </div>
        {profile}
      </div>
      
    );
  }
});

export default Nav;