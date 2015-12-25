import React from 'react';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import Login from './login.js';

let Nav = React.createClass({
  getInitialState: function(){
    return {
      profileBox: this.props.profileBox,
      messageBox: this.props.messageBox
    }
  },
  showProfile: function(){
    this.setState({profileBox: !this.state.profileBox});
  },
  componentWillReceiveProps: function(nextProps){
    this.setState({
      profileBox: nextProps.profileBox,
      messageBox: nextProps.messageBox
    })
  },
  back: function(){
    console.log(history.length);
    var r = history.go(-1);
    console.log(r);
    //this.setState({back: !(r==undefined)})
  },
  forward: function(){
    console.log(history.length);
    var r = history.go(1);
    console.log(r);
    //this.setState({forward: !(r==undefined)})
  },
  render: function(){
    var profile;
    if(this.props.isLogin&&this.state.profileBox){
      profile = <div className="profile-menu">{this.props.profile.nickname}</div>
    }
    else if((!this.props.isLogin)&&(this.state.profileBox)){
      profile = <Login />
    }
    return(
      <div className="nav red">
        <div className="logo">
          <img src="./img/logo.png" alt="logo" />
        </div>
        <Link to="/discover" className="homelink"><div className="logo-letters">网易云音乐</div></Link>
        <div className="btn-group">
          <i onClick={this.back} id="btn-back" className="glyphicon glyphicon-menu-left active"></i>
          <i onClick={this.forward} id="btn-forward" className="glyphicon glyphicon-menu-right active"></i>
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